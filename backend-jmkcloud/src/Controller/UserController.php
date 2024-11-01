<?php

namespace App\Controller;

use App\Entity\PendingRegistration;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;
use App\Service\EmailService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Bundle\SecurityBundle\Security;
use Stripe\Stripe;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    private $passwordHasher;
    private $jwtManager;
    private $emailService;

    public function __construct(UserPasswordHasherInterface $passwordHasher, EmailService $emailService, JWTTokenManagerInterface $jwtManager, private Security $security, private RequestStack $requestStack)
    {
        $this->passwordHasher = $passwordHasher;
        $this->jwtManager = $jwtManager;
        $this->emailService = $emailService;
    }

    public function profile(UserInterface $user): JsonResponse
    {
        return new JsonResponse([
            'email' => $user->getUserIdentifier(),
            'alias' => $user instanceof User ? $user->getAlias() : null,
            'storage_limit' => $user instanceof User ? $user->getStorageLimit() : null,
            'roles' => $user->getRoles(),
        ]);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(EntityManagerInterface $em, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['email']) || !isset($data['password'])) {
                return new JsonResponse(['message' => 'Veuillez fournir un email et un mot de passe.'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $user = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);

            if (!$user || !$this->passwordHasher->isPasswordValid($user, $data['password'])) {
                return new JsonResponse(['message' => 'Identifiants invalides'], JsonResponse::HTTP_UNAUTHORIZED);
            }

            $token = $this->jwtManager->create($user);

            return new JsonResponse(['token' => $token], JsonResponse::HTTP_OK);
        } catch (BadRequestHttpException $e) {
            return new JsonResponse(['message' => $e->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        } catch (UnauthorizedHttpException $e) {
            return new JsonResponse(['message' => $e->getMessage()], JsonResponse::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Une erreur est survenue lors de la connexion.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function register(EntityManagerInterface $em, Request $request): Response
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['email']) || !isset($data['password']) || !isset($data['username'])) {
                throw new BadRequestHttpException('Veuillez fournir un email, un mot de passe, et un nom d\'utilisateur.');
            }

            if (strlen($data['email']) < 3 || strlen($data['email']) > 50) {
                throw new BadRequestHttpException('L\'email doit contenir entre 3 et 50 caractères.');
            }

            if (!preg_match('/^[a-zA-Z0-9_.\s-]{3,30}$/', $data['username'])) {
                throw new BadRequestHttpException('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères et ne peut contenir que des lettres, chiffres, tirets, points, espaces et underscores.');
            }

            if (strlen($data['password']) < 8 || strlen($data['password']) > 50) {
                throw new BadRequestHttpException('Le mot de passe doit contenir entre 8 et 50 caractères.');
            }

            $existingPending = $em->getRepository(PendingRegistration::class)
                ->findOneBy(['email' => $data['email']]);

            if ($existingPending) {
                if ($existingPending->getExpiresAt() < new \DateTime()) {
                    $em->remove($existingPending);
                    $em->flush();
                } else {
                    if ($existingPending->getAlias() !== $data['username'] || $existingPending->getPassword() !== $data['password']) {
                        $existingPending->setAlias($data['username']);

                        $tempUser = new User();
                        $hashedPassword = $this->passwordHasher->hashPassword($tempUser, $data['password']);
                        $existingPending->setPassword($hashedPassword);

                        $em->persist($existingPending);
                        $em->flush();

                        $this->emailService->sendConfirmationEmail($data['email'], $existingPending->getToken());

                        return new JsonResponse([
                            'message' => 'Un nouvel email de confirmation vous a été envoyé.',
                            'email' => $data['email']
                        ], Response::HTTP_OK);
                    } else {
                        $this->emailService->sendConfirmationEmail($data['email'], $existingPending->getToken());

                        return new JsonResponse([
                            'message' => 'Un nouvel email de confirmation vous a été envoyé.',
                            'email' => $data['email']
                        ], Response::HTTP_OK);
                    }
                }
            }

            $existingPendingAlias = $em->getRepository(PendingRegistration::class)
                ->findOneBy(['alias' => $data['username']]);

            if ($existingPendingAlias && $existingPendingAlias->getEmail() !== $data['email']) {
                if ($existingPendingAlias->getExpiresAt() < new \DateTime()) {
                    $em->remove($existingPendingAlias);
                    $em->flush();
                } else {
                    throw new ConflictHttpException('Ce nom d\'utilisateur est temporairement réservé. Veuillez en choisir un autre ou réessayer plus tard.');
                }
            }

            $existingUserEmail = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if ($existingUserEmail) {
                throw new ConflictHttpException('Cet email existe déjà.');
            }

            $existingUserUsername = $em->getRepository(User::class)->findOneBy(['alias' => $data['username']]);
            if ($existingUserUsername) {
                throw new ConflictHttpException('Ce nom d\'utilisateur existe déjà.');
            }

            $pendingRegistration = new PendingRegistration();
            $pendingRegistration->setEmail($data['email']);
            $pendingRegistration->setAlias($data['username']);
            $tempUser = new User();
            $hashedPassword = $this->passwordHasher->hashPassword($tempUser, $data['password']);
            $pendingRegistration->setPassword($hashedPassword);
            $pendingRegistration->setToken(bin2hex(random_bytes(32)));

            $em->persist($pendingRegistration);
            $em->flush();

            $this->emailService->sendConfirmationEmail($data['email'], $pendingRegistration->getToken());

            return new JsonResponse([
                'message' => 'Un email de confirmation vous a été envoyé.',
                'email' => $data['email']
            ], Response::HTTP_OK);
        } catch (BadRequestHttpException $e) {
            return new JsonResponse(['message' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (ConflictHttpException $e) {
            return new JsonResponse(['message' => $e->getMessage()], Response::HTTP_CONFLICT);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Une erreur est survenue lors de la pré-inscription: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function confirmEmail(EntityManagerInterface $em, Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $token = $data['token'] ?? null;

            $pendingRegistration = $em->getRepository(PendingRegistration::class)
                ->findOneBy(['token' => $token]);

            if (!$pendingRegistration) {
                return new JsonResponse(['message' => 'Token invalide'], Response::HTTP_BAD_REQUEST);
            }

            if ($pendingRegistration->getExpiresAt() < new \DateTime()) {
                return new JsonResponse(['message' => 'Token expiré'], Response::HTTP_BAD_REQUEST);
            }

            Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);
            $stripeSession = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card', 'paypal'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'eur',
                        'unit_amount' => 2000,
                        'product_data' => [
                            'name' => 'Inscription à JMK Cloud',
                            'description' => 'Paiement unique pour s\'inscrire à JMK Cloud et bénéficier de 20 Go de stockage',
                        ],
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => 'http://localhost:5173/register/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => 'http://localhost:5173/register/',
                'customer_email' => $pendingRegistration->getEmail(),
                'expires_at' => time() + (24 * 60 * 60)
            ]);

            $pendingRegistration->setStripeSessionId($stripeSession->id);
            $em->flush();

            return new JsonResponse([
                'message' => 'Email confirmé avec succès',
                'payment_url' => $stripeSession->url
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Une erreur est survenue: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function confirmRegistration(EntityManagerInterface $em, Request $request): Response
    {
        try {
            $data = json_decode($request->getContent(), true);
            $sessionId = $data['session_id'] ?? null;

            $pendingRegistration = $em->getRepository(PendingRegistration::class)
                ->findOneBy(['stripeSessionId' => $sessionId]);

            if (!$pendingRegistration) {
                throw new BadRequestHttpException('Inscription invalide ou expirée.');
            }

            Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);
            $stripeSession = \Stripe\Checkout\Session::retrieve($sessionId);

            if ($stripeSession->payment_status !== 'paid') {
                throw new \Exception('Le paiement n\'a pas été complété.');
            }

            $user = new User();
            $user->setEmail($pendingRegistration->getEmail());
            $user->setAlias($pendingRegistration->getAlias());
            $user->setPassword($pendingRegistration->getPassword());
            $user->setStorageLimit(20400);
            $user->setCreatedAt(new \DateTimeImmutable());
            $user->setUpdatedAt(new \DateTime());
            $user->setRoles(['ROLE_USER']);
            $user->setIsConfirmed(true);

            $em->persist($user);
            $em->remove($pendingRegistration);
            $em->flush();

            $token = $this->jwtManager->create($user);

            return new JsonResponse(['token' => $token], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Une erreur est survenue: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getUsers(EntityManagerInterface $em): JsonResponse
    {
        try {
            if (!$this->isGranted('ROLE_ADMIN')) {
                return new JsonResponse(['message' => 'Accès refusé'], JsonResponse::HTTP_FORBIDDEN);
            }

            $users = $em->getRepository(User::class)->findAll();

            $usersData = [];
            foreach ($users as $user) {
                $usersData[] = [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getAlias(),
                    'storage_limit' => $user->getStorageLimit(),
                    'roles' => $user->getRoles(),
                ];
            }
            return new JsonResponse($usersData, JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Une erreur est survenue lors de la récupération des utilisateurs.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getUserById(User $user = null): JsonResponse
    {
        try {
            if (!$this->isGranted('ROLE_ADMIN')) {
                return new JsonResponse(['message' => 'Accès refusé'], JsonResponse::HTTP_FORBIDDEN);
            }

            if (!$user) {
                throw new NotFoundHttpException('Utilisateur non trouvé.');
            }

            $userData = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getAlias(),
                'storage_limit' => $user->getStorageLimit(),
            ];

            return new JsonResponse($userData, JsonResponse::HTTP_OK);
        } catch (NotFoundHttpException $e) {
            return new JsonResponse(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Une erreur est survenue lors de la récupération de l\'utilisateur.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getUserByEmail(EntityManagerInterface $em, string $email): JsonResponse
    {
        try {
            if (!$this->isGranted('ROLE_ADMIN')) {
                return new JsonResponse(['message' => 'Accès refusé'], JsonResponse::HTTP_FORBIDDEN);
            }

            $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

            if (!$user) {
                throw new NotFoundHttpException('Utilisateur non trouvé.');
            }

            $userData = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
            ];

            return new JsonResponse($userData, JsonResponse::HTTP_OK);
        } catch (NotFoundHttpException $e) {
            return new JsonResponse(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Une erreur est survenue lors de la récupération de l\'utilisateur.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteUser(EntityManagerInterface $em, User $user = null): JsonResponse
    {
        try {
            if (!$this->isGranted('ROLE_ADMIN')) {
                return new JsonResponse(['message' => 'Accès refusé'], JsonResponse::HTTP_FORBIDDEN);
            }

            if (!$user) {
                throw new NotFoundHttpException('Utilisateur non trouvé.');
            }

            $em->remove($user);
            $em->flush();

            return new JsonResponse(['message' => 'Utilisateur supprimé avec succès.'], JsonResponse::HTTP_OK);
        } catch (NotFoundHttpException $e) {
            return new JsonResponse(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur lors de la suppression de l\'utilisateur : ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteUserByEmail(EntityManagerInterface $em, string $email): JsonResponse
    {
        try {
            if (!$this->isGranted('ROLE_ADMIN')) {
                return new JsonResponse(['message' => 'Accès refusé'], JsonResponse::HTTP_FORBIDDEN);
            }

            $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

            if (!$user) {
                throw new NotFoundHttpException('Utilisateur non trouvé.');
            }

            $em->remove($user);
            $em->flush();

            return new JsonResponse(['message' => 'Utilisateur supprimé avec succès.'], JsonResponse::HTTP_OK);
        } catch (NotFoundHttpException $e) {
            return new JsonResponse(['message' => $e->getMessage()], JsonResponse::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur lors de la suppression de l\'utilisateur : ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function testAuth(): JsonResponse
    {
        $user = $this->security->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }
        return new JsonResponse([
            'message' => 'Authentifié avec succès',
            'user' => $user->getUserIdentifier(),
            'roles' => $user->getRoles()
        ]);
    }
}
