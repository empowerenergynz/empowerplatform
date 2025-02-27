<?php declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DonationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'address' => $this->address,
            'gps_coordinates' => $this->gps_coordinates,
            'icp' => $this->icp,
            'retailer' => $this->retailer,
            'account_number' => $this->account_number,
            'amount' => $this->amount,
            'is_dollar' => $this->is_dollar,
            'buyback_rate' => $this->buyback_rate,
            'is_active' => $this->is_active,
            'user' => UserResource::make($this->whenLoaded('user')),
            'user_id' => $this->user_id,
        ];
    }
}
