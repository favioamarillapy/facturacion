<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('user', 'UserController');
Route::group(['prefix' => 'user'], function () {
    Route::post('signIn', ['as' => 'user.signIn', 'uses' => 'UserController@signIn']);
    Route::post('checkToken', ['as' => 'user.checkToken', 'uses' => 'UserController@checkToken']);
    Route::post('validarEmail', ['as' => 'user.validarEmail', 'uses' => 'UserController@validarEmail']);
    Route::post('cambiarPassword', ['as' => 'user.cambiarPassword', 'uses' => 'UserController@cambiarPassword']);
});

Route::resource('cliente', 'ClienteController');

Route::resource('timbrado', 'TimbradoController');
Route::get('timbradoActivo', 'TimbradoController@getTimbradoActivo');
Route::put('ultimoUsado/{id}', 'TimbradoController@updateUltUsado');

Route::resource('factura', 'FacturaController');
Route::get('factura/detalle/{id}', 'FacturaController@detalle');
