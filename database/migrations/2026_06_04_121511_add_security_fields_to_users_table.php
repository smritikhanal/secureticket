<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
        $table->string('role')->default('user');        // user, organizer, admin
        $table->string('mfa_secret')->nullable();
        $table->boolean('mfa_enabled')->default(false);
        $table->timestamp('password_changed_at')->nullable();
        $table->json('password_history')->nullable();   // last 5 hashes
        $table->integer('failed_login_attempts')->default(0);
        $table->timestamp('locked_until')->nullable();
        $table->string('avatar')->nullable();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
        $table->dropColumn([
            'role','mfa_secret','mfa_enabled','password_changed_at',
            'password_history','failed_login_attempts','locked_until','avatar'
        ]);
    });
    }
};
