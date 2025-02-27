<?php declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'reference' => $this->reference,
            'invited_at' => $this->invited_at,
            'last_login_at' => $this->last_login_at,
            'deleted_at' => $this->deleted_at,
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
            'agency_id' => $this->agency_id,
            'agency' => IdNameResource::make($this->whenLoaded('agency')),
        ];
    }
}
