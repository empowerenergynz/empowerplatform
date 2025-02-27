<?php declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class IdNameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // this is a general purpose id/name resource which could be used for multiple things
        // e.g. Agencies, Users & Retailers, when the UI only really needs the name
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
