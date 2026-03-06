<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;
use App\Services\UserService;

class UserController extends Controller {
    protected $userService;

    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    /**
     * Menampilkan daftar pengguna.
     */
    public function index() {
        $query = User::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        // Menangani filter
        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        if (request("created_at")) {
            $query->whereDate("created_at", request("created_at"));
        }

        $users = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(request('per_page', 10))
            ->withQueryString();

        return Inertia::render('User/Index', [
            'users' => UserCrudResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Menampilkan formulir pembuatan pengguna baru.
     */
    public function create() {
        return Inertia::render('User/Create', [
            'success' => session('success'),
        ]);
    }

    /**
     * Menyimpan pengguna baru ke database.
     */
    public function store(StoreUserRequest $request) {
        $data = $request->validated();
        $data['email_verified_at'] = now();
        $data['password'] = bcrypt($data['password']);
        User::create($data);

        return to_route('user.index')->with('success', 'Pengguna berhasil dibuat.');
    }

    /**
     * Menampilkan detail pengguna spesifik.
     */
    public function show(User $user) {
        //
    }

    /**
     * Menampilkan formulir edit pengguna.
     */
    public function edit(User $user) {
        return Inertia::render('User/Edit', [
            'user' => new UserCrudResource($user),
            'success' => session('success'),
        ]);
    }

    /**
     * Memperbarui data pengguna di database.
     */
    public function update(UpdateUserRequest $request, User $user) {
        $data = $request->validated();
        $password = $data['password'] ?? null;

        if ($password) {
            $data['password'] = bcrypt($password);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return to_route('user.index')->with('success', 'Data pengguna berhasil diperbarui.');
    }

    public function destroy(User $user) {
        $name = $user->name;

        if ($user->id === Auth::id()) {
            return to_route('user.index')->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $this->userService->deleteUser($user);

        return to_route('user.index')->with('success', "Pengguna '$name' berhasil dihapus.");
    }

    public function search(Request $request, Project $project) {
        $query = $request->input('email');

        if (empty($query)) {
            return response()->json(['users' => []]);
        }

        $user = User::where('email', $query)->first();

        if ($user) {
            $isMember = $user->id == $project->created_by ||
                $project->invitedUsers()
                ->where('user_id', $user->id)
                ->wherePivot('status', 'accepted')
                ->exists();

            if ($isMember) {
                return response()->json([
                    'error' => 'Pengguna ini sudah menjadi bagian dari proyek.',
                    'users' => []
                ], 409);
            }

            $hasPendingInvite = $project->invitedUsers()
                ->where('user_id', $user->id)
                ->wherePivot('status', 'pending')
                ->exists();

            if ($hasPendingInvite) {
                return response()->json([
                    'error' => 'Pengguna ini sudah diundang dan statusnya masih menunggu konfirmasi.',
                    'users' => []
                ], 409);
            }

            return response()->json(['users' => [$user]]);
        }

        if (filter_var($query, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'error' => 'Tidak ada pengguna yang ditemukan dengan email ini.',
                'users' => []
            ], 404);
        }

        return response()->json([
            'error' => 'Silakan masukkan alamat email yang valid.',
            'users' => []
        ], 422);
    }
}