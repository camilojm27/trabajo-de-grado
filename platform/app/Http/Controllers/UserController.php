<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Inertia\Response
    {
        $query = User::query();

        if (request('search')) {
            $rq = strtolower(request('search'));
            $query->where(function ($q) use ($rq) {
                $q->where('name', 'like', '%'.$rq.'%')
                    ->orWhere('email', 'like', '%'.$rq.'%');
            });
        }

        $users = $query->paginate(10)->through(function ($user) {
            return array_merge($user->toArray(), ['is_banned' => $user->isBanned()]);
        });

        return Inertia::render('Users/Users', [
            'users' => $users,
            'queryParams' => request()->query(),
        ]);
    }

    //    public function destroy(Request $request): RedirectResponse
    //    {
    //        $request->validate([
    //            'password' => ['required', 'current_password'],
    //            'user_id' => ['required', 'exists:users,id'], // Validate that the user_id exists in the users table
    //        ]);
    //
    //        $userId = $request->input('user_id');
    //
    //        // Find the user by the provided user ID
    //        $user = User::find($userId);
    //
    //        // Logout the current user only if they are the ones being deleted
    //        if ($user->id === $request->user()->id) {
    //            Auth::logout();
    //        }
    //
    //        // Delete the user
    //        $user->delete();
    //
    //        if ($user->id === $request->user()->id) {
    //            $request->session()->invalidate();
    //            $request->session()->regenerateToken();
    //
    //            return Redirect::to('/');
    //        }
    //
    //        // Redirect back with success message if the deleted user was not the logged-in user
    //        return Redirect::back()->with('success', 'User deleted successfully.');
    //    }

    public function ban(User $user): \Illuminate\Http\RedirectResponse
    {
        if ($user->id === request()->user()->id) {
            return redirect()->back()->withErrors(['message' => 'You cannot ban your own account.']);
        }
        if ($user->id === 1) {
            return redirect()->back()->withErrors(['message' => 'You cannot BAN the first Administrator account.']);
        }

        if ($user->isNotBanned()) {
            $user->ban([
                'created_by_id' => request()->user()->id,
            ]);

            return redirect()->back()->with('success', 'User banned.');
        }

        return redirect()->back()->withErrors(['message' => 'User is already banned.']);

    }

    public function unban(User $user): \Illuminate\Http\RedirectResponse
    {
        if ($user->isBanned()) {
            $user->unban();

            return redirect()->back()->with('success', 'User unbanned.');

        }

        return redirect()->back()->withErrors(['message' => 'User is already unbanned.']);
    }
}
