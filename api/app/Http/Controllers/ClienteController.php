<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Validator;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseController as BaseController;
use App\Cliente;


class ClienteController extends BaseController
{
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Cliente::orderBy('razon_social', 'asc');

        $ruc = $request->query('ruc');
        if ($ruc) {
            $query->where('ruc', 'LIKE', '%'.$ruc.'%');
        }

        $razon_social = $request->query('razon_social');
        if ($razon_social) {
            $query->where('razon_social', 'LIKE', '%'.$razon_social.'%');
        }

        $telefono = $request->query('telefono');
        if ($telefono) {
            $query->where('telefono', 'LIKE', '%'.$telefono.'%');
        }

        $direccion = $request->query('direccion');
        if ($direccion) {
            $query->where('direccion', 'LIKE', '%'.$direccion.'%');
        }

        $paginar = $request->query('paginar');
        $listar = (boolval($paginar)) ? 'paginate' : 'get';

        $data = $query->$listar();
        
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
        $ruc = $request->input("ruc");
        $razon_social = $request->input("razon_social");
        $telefono = $request->input("telefono");
        $direccion = $request->input("direccion");

        $validator = Validator::make($request->all(), [
            'ruc'  => 'required',
            'razon_social'  => 'required',
            'telefono'  => 'required',
            'direccion'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $cliente = new Cliente();
        $cliente->ruc = $ruc;
        $cliente->razon_social = $razon_social;
        $cliente->telefono = $telefono;
        $cliente->direccion = $direccion;

        if ($cliente->save()) {
            return $this->sendResponse(true, 'Pais registrado', $cliente, 201);
        }
        
        return $this->sendResponse(false, 'Pais no registrado', null, 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $cliente = Cliente::find($id);

        if (is_object($cliente)) {
            return $this->sendResponse(true, 'Se listaron exitosamente los registros', $cliente, 200);
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
        $ruc = $request->input("ruc");
        $razon_social = $request->input("razon_social");
        $telefono = $request->input("telefono");
        $direccion = $request->input("direccion");

        $validator = Validator::make($request->all(), [
            'ruc'  => 'required',
            'razon_social'  => 'required',
            'telefono'  => 'required',
            'direccion'  => 'required'
        ]);

        if ($validator->fails()) {
            return $this->sendResponse(false, 'Error de validacion', $validator->errors(), 400);
        }

        $cliente = Cliente::find($id);
        if ($cliente) {
            $cliente->ruc = $ruc;
            $cliente->razon_social = $razon_social;
            $cliente->telefono = $telefono;
            $cliente->direccion = $direccion;
            if ($cliente->save()) {
                return $this->sendResponse(true, 'Cliente actualizado', $cliente, 200);
            }
            
            return $this->sendResponse(false, 'Cliente no actualizado', null, 400);
        }
        
        return $this->sendResponse(false, 'No se encontro la Cliente', null, 404);
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
}
