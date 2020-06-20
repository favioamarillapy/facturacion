<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Factura;
use App\FacturaDetalle;
use App\Convertidor;
use PDF;

class FacturaController extends BaseController
{
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Factura::with(['cliente']);

        $id_cliente = $request->query('id_cliente');
        if ($id_cliente) {
            $query->where('id_cliente', '=', $id_cliente);
        }

        $fecha_emision = $request->query('fecha_emision');
        if ($fecha_emision) {
            $query->where('fecha_emision', '=', $fecha_emision);
        }

        $numero = $request->query('numero');
        if ($numero) {
            $query->where('numero', 'LIKE', '%'.$numero.'%');
        }

        $tipo = $request->query('tipo');
        if ($tipo) {
            $query->where('tipo', 'LIKE', '%'.$tipo.'%');
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';
        
        $data = $query->orderBy('fecha_emision', 'desc')->$listar();
        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $data, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $id_cliente = $request->input("id_cliente");
        $fecha_emision = $request->input("fecha_emision");
        $numero = $request->input("numero");
        $tipo = $request->input("tipo");
        $total = $request->input("total");
        $exento = $request->input("exento");
        $iva_5 = $request->input("iva_5");
        $iva_10 = $request->input("iva_10");
        $detalles = $request->input("detalles");

        $validator = Validator::make($request->all(), [
            'id_cliente'  => 'required',
            'fecha_emision'  => 'required',
            'numero'  => 'required',
            'tipo'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        //validar que los detalles llegaron
        if (count($detalles) <= 0) {
            return $this->sendResponse(false, 'Debe agregar por lo menos una sucursal', null);
        }

        $factura = new Factura();
        $factura->id_cliente = $id_cliente;
        $factura->fecha_emision = $fecha_emision;
        $factura->numero = $numero;
        $factura->tipo = $tipo;
        $factura->total = $total;
        $factura->exento = $exento;
        $factura->iva_5 = $iva_5;
        $factura->iva_10 = $iva_10;

        if ($factura->save()) {
            $total = 0;

            foreach ($detalles as $detalle) {
                $facturaDetalle = new FacturaDetalle();
                $facturaDetalle->id_factura = $factura->id;
                $facturaDetalle->cantidad = $detalle['cantidad'];
                $facturaDetalle->descripcion = $detalle['descripcion'];
                $facturaDetalle->precio_unitario = $detalle['precio_unitario'];
                $facturaDetalle->exento = $detalle['exento'];
                $facturaDetalle->iva_5 = $detalle['iva_5'];
                $facturaDetalle->iva_10 = $detalle['iva_10'];

                if (!$facturaDetalle->save()) {
                    return $this->sendResponse(true, 'Detalle de factura no registrado', $facturaDetalle, 400);
                    break;
                }
            }

            return $this->sendResponse(true, 'Factura registrado', $factura, 201);
        }
        
        return $this->sendResponse(false, 'Factura no registrado', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $factura = Factura::with(['cliente'])->find($id);

        if (is_object($factura)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $factura, 200);
        }

        return $this->sendResponse(false, 'No se encontro la Pais', null);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // $id_cliente = $request->input("id_cliente");
        // $fecha_emision = $request->input("fecha_emision");
        // $numero = $request->input("numero");
        // $tipo = $request->input("tipo");

        // $validator = Validator::make($request->all(), [
        //     'id_cliente'  => 'required',
        //     'fecha_emision'  => 'required',
        //     'numero'  => 'required',
        //     'tipo'  => 'required'
        // ]);

        // if ($validator->fails()) {
        //     return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        // }


        // if ($validator->fails()) {
        //     return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        // }

        // $factura = Cliente::find($id);
        // if ($factura) {
        //     $factura->id_cliente = $id_cliente;
        //     $factura->fecha_emision = $fecha_emision;
        //     $factura->numero = $numero;
        //     $factura->tipo = $tipo;
        //     if ($factura->save()) {
        //         return $this->sendResponse(true, 'Factura actualizada', $factura, 200);
        //     }
            
        //     return $this->sendResponse(false, 'Factura no actualizada', null, 400);
        // }
        
        // return $this->sendResponse(false, 'No se encontro la Factura', null, 404);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
    }

    public function detalle($id)
    {        
        $query = FacturaDetalle::orderBy('created_at', 'asc');

        $query->where('id_factura', '=', $id);
        $data = $query->get();
        
        return $this->sendResponse(true, 'Listado obtenido exitosamente', $data, 200);
    }

    public function generarPDF($id) {
        $factura = Factura::with('cliente')->find($id);

        if ($factura) {

            $detalles = FacturaDetalle::where('id_factura', '=', $id)->get();
            if ($detalles) {
                $convertidor = new Convertidor();
                $datos =  [
                    'factura' => $factura,
                    'detalles' => $detalles,
                    'total_texto' => strtoupper($convertidor->numeroATexto($factura->total))
                ];
                $pdf = PDF::loadView('factura', $datos)->setPaper('A4', 'portrait');  
                return $pdf->stream();
                // return $pdf->download("Factura-$factura->numero.pdf");

            }

            return $this->sendResponse(false, 'No se encontraron detalles para esta factura', null, 404);

        }

        return $this->sendResponse(false, 'No se encontro la factura', null, 404);
    }
}
