<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContainerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'node' => 'required|uuid',
            'name' => 'required|string|max:64|regex:/^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*$/',
            'image' => 'required|regex:/^[a-z0-9]+([._-][a-z0-9]+)*(:[a-zA-Z0-9._-]+)?$/',
            'attributes' => 'required',
        ];
    }
}
