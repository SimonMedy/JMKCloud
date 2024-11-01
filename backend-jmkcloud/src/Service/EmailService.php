<?php

namespace App\Service;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailService
{
    public function __construct(
        private MailerInterface $mailer
    ) {}

    public function sendConfirmationEmail(string $to, string $token): void
    {
        $emailContent = "
        <div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 20px auto;'>
            <div style='background-color: #f9f9f9; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;'>
                <h1 style='text-align: center; color: #ff6600;'>Bienvenue sur JMK Cloud!</h1>
                <p>Bonjour,</p>
                <p>Merci de vous être inscrit sur JMK Cloud ! Pour continuer votre inscription, veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :</p>
                <div style='text-align: center; margin: 20px 0;'>
                    <a href='https://jmkcloud.vercel.app/confirm/{$token}' 
                       style='display: inline-block; padding: 10px 20px; color: #fff; background-color: #ff6600; border-radius: 4px; text-decoration: none; font-weight: bold;'>
                        Vérifier mon email
                    </a>
                </div>
                <p>Ce lien est valable pendant 24 heures.</p>
                <p>Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email en toute sécurité.</p>
            </div>
            <footer style='text-align: center; margin-top: 20px; font-size: 12px; color: #888;'>
                © 2024 JMK Cloud. Tous droits réservés.<br>
                <a href='https://jmkcloud.vercel.app/' style='color: #888; text-decoration: underline;'>Conditions d'utilisation</a> | 
                <a href='https://jmkcloud.vercel.app/' style='color: #888; text-decoration: underline;'>Politique de confidentialité</a>
            </footer>
        </div>
    ";

        $email = (new Email())
            ->from('yxtomix@gmail.com')
            ->replyTo('yxtomix@gmail.com')
            ->to($to)
            ->subject('Confirmez votre inscription à JMK Cloud')
            ->html($emailContent);

        $this->mailer->send($email);
    }
}
