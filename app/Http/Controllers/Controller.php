<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Session\FlashMessage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function addFlashMessage(string $status, string $title, string $content)
    {
        $request = request();
        $messages = $request->session()->get('messages', []);
        array_push($messages, (new FlashMessage(
            $status,
            $title,
            $content,
        )));
        $request->session()->flash('messages', $messages);
    }
}
