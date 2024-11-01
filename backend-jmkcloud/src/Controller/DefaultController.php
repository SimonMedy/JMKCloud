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


    public function test(): JsonResponse
    {
        return $this->json([
            'message' => 'Mon test'
        ]);
    }
}
