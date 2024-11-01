<?php

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    // Override the getCacheDir method
    public function getCacheDir(): string
    {
        return '/tmp/symfony/cache/' . $this->environment;
    }

    public function getLogDir(): string
    {
        return '/tmp/symfony/logs';
    }
}
