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
        
        .nro-factura {
            font-size: 20px;
            margin-top: 29px;
            margin-left: 440;
        }

        .cliente {
            font-size: 13px;
        }

        .servicio {
            font-size: 12px
        }
    </style>
</head>

<body>
    <div class="original">
        {{-- numero de factura --}}
        <div style="width: 100%">
            <p class="nro-factura">0000001</p>
        </div>
        <br>

        {{-- datos del cliente --}}
        <div class="cliente" style="width: 100%; margin-left: 40px">01/01/2020</div>
        <div class="cliente" style="width: 100%; margin-left: 40px">5628828-0</div>
        <div class="cliente" style="width: 100%; margin-left: 140px">Favio Amarilla Miño</div>
        <div class="cliente" style="width: 100%; margin-left: 60px">Calle 13 de Setiembre</div>

        <br>
        {{-- lista de servicios --}}
        <div style="width: 100%;">
            <table style="width:100%">
                <tbody>
                    @foreach ($detalles as $detalle)
                    <tr>
                        <td class="servicio" style="width: 37px; text-align: center;"> {{ $detalle->cantidad }}</td>
                        <td class="servicio" style="width: 37px; text-align: center;">0</td>
                        <td class="servicio" style="width: 300px;">{{ $detalle->descripcion }}</td>
                        <td class="servicio" style="width: 56px; text-align: center;">{{ $detalle->precio_unitario }}
                        </td>
                        <td class="servicio" style="width: 75px; text-align: right;">{{ $detalle->exento }}</td>
                        <td class="servicio" style="width: 100px; text-align: right;">{{ $detalle->iva_5 }}</td>
                        <td class="servicio" style="width: 75px; text-align: right;">{{ $detalle->iva_10 }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        {{-- totales --}}
        <div class="cliente" style="width: 100%; margin-left: 50px; margin-top: 260px">100.000</div>
        <div class="cliente" style="width: 100%; margin-left: 70px; margin-top: 10px">Cien mil</div>
        <div class="cliente" style="width: 100%; margin-top: 8px">
            <span style="margin-left: 185px">0</span>
            <span style="margin-left: 155px">100.00</span>
            <span style="margin-left: 155px">100.00</span>
        </div>
    </div>


    <div class="duplicado" style="margin-top: 100px">
        {{-- numero de factura --}}
        <div style="width: 100%">
            <p class="nro-factura">0000001</p>
        </div>
        <br>

        {{-- datos del cliente --}}
        <div class="cliente" style="width: 100%; margin-left: 40px">01/01/2020</div>
        <div class="cliente" style="width: 100%; margin-left: 40px">5628828-0</div>
        <div class="cliente" style="width: 100%; margin-left: 140px">Favio Amarilla Miño</div>
        <div class="cliente" style="width: 100%; margin-left: 60px">Calle 13 de Setiembre</div>

        <br>
        {{-- lista de servicios --}}
        <div style="width: 100%;">
            <table style="width:100%">
                <tbody>
                    @foreach ($detalles as $detalle)
                    <tr>
                        <td class="servicio" style="width: 37px; text-align: center;"> {{ $detalle->cantidad }}</td>
                        <td class="servicio" style="width: 37px; text-align: center;">0</td>
                        <td class="servicio" style="width: 300px;">{{ $detalle->descripcion }}</td>
                        <td class="servicio" style="width: 56px; text-align: center;">{{ $detalle->precio_unitario }}
                        </td>
                        <td class="servicio" style="width: 75px; text-align: right;">{{ $detalle->exento }}</td>
                        <td class="servicio" style="width: 100px; text-align: right;">{{ $detalle->iva_5 }}</td>
                        <td class="servicio" style="width: 75px; text-align: right;">{{ $detalle->iva_10 }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        {{-- totales --}}
        <div class="cliente" style="width: 100%; margin-left: 50px; margin-top: 260px">100.000</div>
        <div class="cliente" style="width: 100%; margin-left: 70px; margin-top: 10px">Cien mil</div>
        <div class="cliente" style="width: 100%; margin-top: 8px">
            <span style="margin-left: 185px">0</span>
            <span style="margin-left: 155px">100.00</span>
            <span style="margin-left: 155px">100.00</span>
        </div>
    </div>

</body>

</html>