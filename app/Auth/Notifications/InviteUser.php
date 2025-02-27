<?php declare(strict_types=1);

namespace App\Auth\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InviteUser extends Notification
{
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(private $token)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via(mixed $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toMail(mixed $notifiable): MailMessage
    {
        $url = url(route('sign_up.create', [
            'token' => $this->token,
        ], false));

        return $this->buildMailMessage($url);
    }

    /**
     * Get the verify email notification mail message for the given URL.
     *
     * @param string $url
     * @return MailMessage
     */
    protected function buildMailMessage(string $url): MailMessage
    {
        return (new MailMessage)
            ->subject(sprintf('Invitation to join %s', config('app.name')))
            ->line(sprintf('You have been invited to join %s', config('app.name')))
            ->action('Setup my account', $url)
            ->line('Thank you for using our application!');
    }
}
