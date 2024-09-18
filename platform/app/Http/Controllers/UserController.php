<?php

namespace App\Http\Controllers;

use App\Models\User;
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

        $users = $query->paginate(10)
            ->withQueryString()
            ->through(function ($user) {
                return array_merge($user->toArray(), ['is_banned' => $user->isBanned()]);
            });

        return Inertia::render('Users/Users', [
            'users' => $users,
            'queryParams' => request()->query(),
        ]);
    }

    public function destroy(User $user): \Illuminate\Http\RedirectResponse //Should be protected by admin middleware
    {
        // return If the user is the first admin or if an admin different to 1 tries to delete an admin account
        if ($user->id === 1 && ($user->is_admin && request()->user()->id != 1)) {
            return redirect()->back()->withErrors(['message' => 'You cannot Delete an Administrator account.']);
        }

        $user->delete();

        return Redirect::back()->with('success', 'User '.$user->id.' deleted successfully.');
    }

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
