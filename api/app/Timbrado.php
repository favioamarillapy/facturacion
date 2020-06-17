<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Timbrado extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'timbrados';
    protected $perPage = 5;

    protected $fillable =[
        'numero', 'fecha_desde', 'fecha_hasta'	
    ];
}
