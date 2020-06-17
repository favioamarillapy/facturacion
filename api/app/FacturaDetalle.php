<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class FacturaDetalle extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'factura_detalles';
    protected $perPage = 5;

    protected $fillable =[
        'id_factura', 'cantidad', 'descripcion', 'precio_unitario', 'exento', 'iva_5', 'iva_10'
    ];

}
