<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'app_default')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to my the JmkCloud API'
        ]);
    }

    #[Route('/test', name: 'app_test')]
    public function test(): JsonResponse
    {
        return $this->json([
            'message' => 'Mon test'
        ]);
    }

    #[Route('/apiv1/test', name: 'app_test')]
    public function testApi(): JsonResponse
    {
        return $this->json([
            'message' => 'Mon test /apiv1/test'
        ]);
    }

    #[Route('/phpinfo', name: 'phpinfo')]
    public function phpinfo(): Response
    {
        return new Response('<pre>' . print_r(get_loaded_extensions(), true) . '</pre>');
    }
}
