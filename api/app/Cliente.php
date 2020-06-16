<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'clientes';
    protected $perPage = 10;

    protected $fillable =[
        'ruc', 'razon_social', 'telefono', 'direccion'	
    ];

}
