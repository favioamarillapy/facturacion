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
            padding: 20 50px 0px 50px;
        }
        
        .nro-factura {
            font-size: 16px;
            margin-top: 29px;
            margin-left: 405;
        }

        .cliente {
            font-size: 14px;
        }

        .servicio {
            font-size: 12px
        }
    </style>
</head>

<body>
    @for($i = 1; $i <= 2; $i++)
    <div class="original" style="{{ ($i == 1) ? 'margin-bottom: 60px;' : ''}}">
        {{-- numero de factura --}}
        <div style="width: 100%; height: 90px;">
            <p class="nro-factura">{{ explode('-', $factura->numero)[2] }}</p>
        </div>

        {{-- datos del cliente --}}
        <div style="width: 100%; height: 70px;">
            <div style="margin-left: 40px">{{ \Carbon\Carbon::parse($factura->fecha_emision)->format('d/m/Y') }}</div>
            <div style="margin-left: 40px">{{ $factura->cliente->ruc }}</div>
            <div style="margin-left: 140px">{{ $factura->cliente->razon_social }}</div>
            <div style="margin-left: 60px">{{ $factura->cliente->direccion }}</div>
        </div>

        <div style="width: 100%; height: 15px;"></div>

        {{-- lista de servicios --}}
        @php
            $total5 = 0;
            $total10 = 0;
            $totalIVA = 0;
        @endphp
        <div style="width:100%; height: 205px;">
            @foreach ($detalles as $detalle)
                <div style="display: block; height: 15px; margin-top: 5px;">
                    <div style="display: inline-block; width: 35px; text-align: center;"> {{ $detalle->cantidad }}</div>
                    <div style="display: inline-block; width: 35px; text-align: center;">0</div>
                    <div style="display: inline-block; width: 295px; padding-left: 10px;">{{ $detalle->descripcion }}</div>
                    <div style="display: inline-block; width: 55px; text-align: center;">{{ number_format(intval($detalle->precio_unitario), 0, ",", ".") }}</div>
                    <div style="display: inline-block; width: 72px; text-align: center;">{{ number_format(intval($detalle->exento), 0, ",", ".") }}</div>
                    <div style="display: inline-block; width: 88px; text-align: center;">{{ number_format(intval($detalle->iva_5), 0, ",", ".") }}</div>
                    <div style="display: inline-block; width: 70px; text-align: center;">{{ number_format(intval($detalle->iva_10), 0, ",", ".") }}</div>
                </div>
                @php
                    $total5 += $detalle->iva_5;
                    $total10 += $detalle->iva_10;
                @endphp
            @endforeach
        </div>

        {{-- totales --}}
        <div class="cliente" style="height: 20px; width: 100%;">
            <span style="margin-left: 80px;">100.000</span>
        </div>
        <div class="cliente" style="height: 30px; width: 100%;">
            <span style="margin-left: 110px;">Gs. {{ $total_texto }}</span>
        </div>
        <div class="cliente" style="height: 20px; width: 100%;">
            <span style="margin-left: 185px">{{ number_format(($total5 / 11), 3, ",", ".") }}</span>
            <span style="margin-left: 155px">{{ number_format(($total10 / 11), 3, ",", ".") }}</span>
            <span style="margin-left: 155px">{{ number_format((($total5 / 11) + ($total10 / 11)), 3, ",", ".") }}</span>
        </div>
    </div>
    @endfor

</body>

</html>