<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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

    #[Route('/app/test', name: 'app_test')]
    public function testApi(): JsonResponse
    {
        return $this->json([
            'message' => 'Mon test /app/test'
        ]);
    }
}
