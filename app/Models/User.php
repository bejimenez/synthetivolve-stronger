<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(Exercise::class);
    }

    public function mesocycles(): HasMany
    {
        return $this->hasMany(Mesocycle::class);
    }

    public function workouts(): HasMany
    {
        return $this->hasMany(Workout::class);
    }

    public function exerciseStats(): HasMany
    {
        return $this->hasMany(ExerciseStat::class);
    }

    public function activeMesocycle()
    {
        return $this->mesocycles()->active()->first();
    }

    public function lastWorkout()
    {
        return $this->workouts()->completed()->latest('completed_at')->first();
    }

    public function currentWorkout()
    {
        return $this->workouts()->inProgress()->first();
    }
}
