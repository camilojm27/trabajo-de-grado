<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreNodeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $request_key = $this->request->get('welcome_key');
        $welcome_key = DB::table('config')->where('key', '=','welcome_key')->value('value');
        return $request_key == $welcome_key;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        //https://man7.org/linux/man-pages/man7/hostname.7.html
        // TODO: Validate json
        return [
            'name' => 'string|max:64|unique:nodes|nullable',
            'hostname' => ['required', 'unique:nodes', 'string', 'max:64', 'regex:/^[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*$/'],
            'ip_address' => 'required|ip',
            'attributes' => 'required|json'
        ];
    }
    protected function prepareForValidation(): void
    {
        $this->merge([
            'ip_address' => $this->ip()
        ]);
    }
}
