<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UtilsController extends Controller
{
    public function ping(): JsonResponse
    {
        return response()->json(['message' => 'pong'])->setStatusCode(200);
    }

}
