<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function createPaymentIntent(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $amount = $data['amount'];
            $storageAmount = $data['storageAmount'];
            Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'eur',
                'metadata' => ['storageAmount' => $storageAmount],
            ]);
            return $this->json(['clientSecret' => $paymentIntent->client_secret]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }

    public function confirmPayment(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $paymentIntentId = $data['paymentIntentId'];
        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);
        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
            $paymentIntent->confirm();

            $user = $this->getUser();
            if ($user instanceof User) {
                $storageAmount = $paymentIntent->metadata['storageAmount'];
                $user->setStorageLimit($user->getStorageLimit() + $storageAmount);
                $this->entityManager->persist($user);
                $this->entityManager->flush();
            }

            return $this->json(['success' => true]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 400);
        }
    }
}
