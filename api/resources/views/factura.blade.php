<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Factura Nº {{$factura->numero}}</title>

    <style>
        * {
            padding: 0;
            margin: 0;
        }

        body {
            padding: 50px 70px 50px 50px;
        }

        .border-all {
            border: 1px solid black;
        }

        .border-bottom {
            border-bottom: 1px solid black;
        }

        .border-right {
            border-right: 1px solid black;
        }

        .text-center {
            text-align: center;
        }

    </style>
</head>

<body>

    <table class="border-all" width="100%" style="width:100%; border-collapse: collapse;">
        <thead>
            <tr>
                <td colspan="4" class="border-bottom border-right">
                    <table width="100%" style="width:100%; border-collapse: collapse;">
                        <tr>
                            <td class="border-bottom">
                                <p>Osmar Daniel Diz Bobadilla</p>
                                <p>CONTADOR</p>
                                <p>ACTIVIDADES DE CONTABILIDAD, TENEDURIA DE LIBROS, AUDITORIA Y ASESORIA FISCAL N.C.P</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>BONANZA E/ANTOLIN IRALA - Cel.: (0986) 276 848</p>
                                <p>ITAGUA - PARAGUAY</p>
                            </td>
                        </tr>
                    </table>
                </td>
                <td colspan="3" class="border-bottom">
                    <p>TIMBRADO Nº 1111111</p>
                    <p>R.U.C 2357657-0</p>
                    <p>Fecha Inicio Vigencia: 08/06/2020</p>
                    <p>Fecha Fin Vigencia: 30/06/2021</p>
                    <p>Nº {{ $factura->numero}}</p>
                    <p>FACTURA</p>
                </td>
            </tr>
            <tr>
                <td colspan="4" class="border-bottom">
                    <p>Fecha: {{ $factura->fecha_emision }}</p>
                    <p>R.U.C.: {{ $factura->cliente->ruc }}</p>
                    <p>Nombre o Razón Social: {{ $factura->cliente->razon_social }}</p>
                    <p>Dirección: {{ $factura->cliente->direccion }}</p>
                </td>
                <td colspan="3" class="border-bottom">
                    <p>Condición: CONTADO ( {{ ($factura->tipo == 'CO') ? 'X' : '' }}  ) CREDITO ( {{ ($factura->tipo != 'CO') ? 'X' : '' }} )</p>
                    <p>Nota de Remisión Nº</p>
                </td>
            </tr>
            <tr>
                <td class="border-bottom border-right text-center" style="width: 60px;">CANT.</td>
                <td class="border-bottom border-right" style="width: 100px;"></td>
                <td class="border-bottom border-right" style="width: 400px;">DESCRIPCIÓN</td>
                <td class="border-bottom border-right text-center" style="width: 125px;">PRECIO UNITARIO</td>
                <td colspan="3" class="border-bottom">
                    <table width="100%" style="width:100%; border-collapse: collapse;" class="text-center">
                        <tr>
                            <td colspan="3" class="border-bottom">VALOR DE VENTA</td>
                        </tr>
                        <tr>
                            <td class="border-right" style="width: 150px;">EXENTAS</td>
                            <td class="border-right" style="width: 100px;">5%</td>
                            <td style="width: 100px;">10%</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </thead>
        <tbody>
            @foreach ($detalles as $detalle) 
                <tr class="border-bottom">
                    <td class="border-bottom border-right text-center" style="width: 60px;"> {{ $detalle->cantidad }}</td>
                    <td class="border-bottom border-right" style="width: 100px;"></td>
                    <td class="border-bottom border-right" style="width: 400px;">{{ $detalle->descripcion }}</td>
                    <td class="border-bottom border-right text-center" style="width: 125px;">{{ $detalle->precio_unitario }}</td>
                    <td colspan="3" class="border-bottom">
                        <table width="100%" style="width:100%; border-collapse: collapse;" class="text-center">
                            <tr colspan="3">
                                <td class="border-right" style="width: 150px;">{{ $detalle->exento }}</td>
                                <td class="border-right" style="width: 100px;">{{ $detalle->iva_5 }}</td>
                                <td style="width: 100px;">{{ $detalle->iva_10 }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            @endforeach
            <tr>
                <td colspan="4" class="border-bottom">Subtotal: </td>
                <td colspan="1" class="border-bottom"></td>
                <td colspan="1" class="border-bottom"></td>
                <td colspan="1" class="border-bottom"></td>
            </tr>
            <tr>
                <td colspan="6" class="border-bottom">Total a pagar</td>
                <td colspan="1" class="border-bottom"></td>
            </tr>
            <tr>
                <td colspan="7" class="border-bottom">
                    <p style="display: inline-block;">Liquidación del I.V.A.</p>
                    <p style="display: inline-block;">(5%)</p>
                    <p style="display: inline-block;">(10%)</p>
                    <p style="display: inline-block;">Total I.V.A.:</p>
                </td>
            </tr>
        </tbody>
    </table>

</body>

</html>