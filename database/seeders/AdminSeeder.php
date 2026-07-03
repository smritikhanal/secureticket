<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'                => 'Admin',
            'email'               => 'admin@secureticket.dev',
            'password'            => Hash::make('Admin@SecureTicket123!'),
            'role'                => 'admin',
            'password_changed_at' => now(),
            'password_history'    => [],
        ]);
    }
}