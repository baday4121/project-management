<?php

namespace App\Notifications;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectInvitationNotification extends Notification {
  use Queueable;

  protected $project;

  public function __construct(Project $project) {
    $this->project = $project;
  }

  public function via($notifiable): array {
    return ['mail'];
  }

  public function toMail($notifiable): MailMessage {
    return (new MailMessage)
      ->subject("Undangan Bergabung: {$this->project->name}")
      ->greeting("Halo, {$notifiable->name}!")
      ->line("Anda telah diundang untuk bergabung dalam proyek: **{$this->project->name}**.")
      ->action('Lihat Undangan', route('project.invitations'))
      ->line('Anda dapat menerima atau menolak undangan ini langsung melalui halaman undangan di akun Anda.')
      ->line('Terima kasih telah menggunakan WorkDei!');
  }
}