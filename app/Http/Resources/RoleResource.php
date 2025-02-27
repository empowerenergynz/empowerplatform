<?php declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $roleExists = $this->id ?? false;
        return $roleExists ? [
            'id' => (string) $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'color' => $this->color,
        ] : null;
    }
}
