<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'facturas';
    protected $perPage = 5;

    protected $fillable =[
        'identificador', 'id_cliente', 'fecha_emision', 'numero', 'tipo', 'total', 'exento', 'iva_5', 'iva_10'
    ];

    public function cliente(){
        return $this->belongsTo('App\Cliente', 'id_cliente');
    }
}
