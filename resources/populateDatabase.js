require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('../src/models/department.model');

const departments = [
    {
        "name": "ARTIGAS",
        "cities": [
            {
                "name": "ARTIGAS"
            },
            {
                "name": "BELLA UNIÓN"
            },
            {
                "name": "TOMÁS GOMENSORO"
            },
            {
                "name": "BALTASAR BRUM"
            },
            {
                "name": "ARROCERA SAN PEDRO"
            },
            {
                "name": "CAINSA CAMPO 3"
            },
            {
                "name": "BERNABÉ RIVERA"
            },
            {
                "name": "CALPICA ITACUMBÚ"
            },
            {
                "name": "COLONIA RIVERA"
            },
            {
                "name": "FRANQUIA"
            },
            {
                "name": "SEQUEIRA"
            },
            {
                "name": "CAINSA 2 ITACUMBÚ"
            },
            {
                "name": "CORONADO"
            },
            {
                "name": "CUAREIM"
            },
            {
                "name": "CUARÓ"
            },
            {
                "name": "GUAYUBIRA"
            },
            {
                "name": "JAVIER DE VIANA"
            },
            {
                "name": "LA BOLSA"
            },
            {
                "name": "LAS PIEDRAS"
            },
            {
                "name": "PAGUERO"
            },
            {
                "name": "PINTADITO"
            },
            {
                "name": "PORT. DE HIERRO Y CAMPODÓNICO"
            },
            {
                "name": "TAMANDUA"
            },
            {
                "name": "MONES QUINTELA"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ARROCERA RIUSA"
            },
            {
                "name": "CAINSA CAMPO 1"
            },
            {
                "name": "CAINSA"
            },
            {
                "name": "PASO CAMPAMENTO"
            },
            {
                "name": "CATALÁN GRANDE"
            },
            {
                "name": "CATALÁN VOLCÁN"
            },
            {
                "name": "CHIFLERO"
            },
            {
                "name": "COLONIA ESTRELLA"
            },
            {
                "name": "COLONIA PALMA"
            },
            {
                "name": "COLONIA VIÑAR"
            },
            {
                "name": "DIEGO LAMAS"
            },
            {
                "name": "ESTIVA"
            },
            {
                "name": "FAGÚNDEZ"
            },
            {
                "name": "GRANJA PERRONI"
            },
            {
                "name": "LENGUAZO"
            },
            {
                "name": "PALMA SOLA"
            },
            {
                "name": "PAREDÓN"
            },
            {
                "name": "PASO DE LA CRUZ"
            },
            {
                "name": "PASO DEL LEÓN"
            },
            {
                "name": "PASO DE RAMOS"
            },
            {
                "name": "PASO FARÍAS"
            },
            {
                "name": "PASO POTRERO"
            },
            {
                "name": "PATITAS"
            },
            {
                "name": "PIEDRA PINTADA"
            },
            {
                "name": "PINTADO GRANDE"
            },
            {
                "name": "PUNTAS DE TRES CRUCES"
            },
            {
                "name": "RICARDINHO"
            },
            {
                "name": "RINCÓN DE PACHECO"
            },
            {
                "name": "RINCÓN DE PINTADO"
            },
            {
                "name": "SARANDÍ DE CUARÓ"
            },
            {
                "name": "SARANDÍ DE YACUY"
            },
            {
                "name": "TARUMAN"
            },
            {
                "name": "TOPADOR"
            },
            {
                "name": "CERRO EJIDO"
            },
            {
                "name": "ZANJA ARUERA"
            },
            {
                "name": "CERRO SIGNORELLI"
            },
            {
                "name": "CERRO SAN EUGENIO"
            },
            {
                "name": "CALNÚ"
            }
        ]
    },
    {
        "name": "CANELONES",
        "cities": [
            {
                "name": "LAS PIEDRAS"
            },
            {
                "name": "CANELONES"
            },
            {
                "name": "LA PAZ"
            },
            {
                "name": "PANDO"
            },
            {
                "name": "SANTA LUCÍA"
            },
            {
                "name": "PIEDRAS DE AFILAR"
            },
            {
                "name": "CUMBRES DE CARRASCO"
            },
            {
                "name": "HARAS DEL LAGO"
            },
            {
                "name": "QUINTA LOS HORNEROS"
            },
            {
                "name": "LAS HIGUERITAS"
            },
            {
                "name": "SOFÍA SANTOS"
            },
            {
                "name": "PROGRESO"
            },
            {
                "name": "SAN RAMÓN"
            },
            {
                "name": "BARROS BLANCOS"
            },
            {
                "name": "FRACC. CNO. MALDONADO"
            },
            {
                "name": "COLONIA NICOLICH"
            },
            {
                "name": "JOAQUÍN SUÁREZ"
            },
            {
                "name": "PASO CARRASCO"
            },
            {
                "name": "SANTA ROSA"
            },
            {
                "name": "SAUCE"
            },
            {
                "name": "TALA"
            },
            {
                "name": "VILLA CRESPO Y SAN ANDRÉS"
            },
            {
                "name": "FRACC. CNO.DEL ANDALUZ Y R.84"
            },
            {
                "name": "ATLÁNTIDA"
            },
            {
                "name": "ESTACIÓN ATLÁNTIDA"
            },
            {
                "name": "CERRILLOS"
            },
            {
                "name": "EMPALME OLMOS"
            },
            {
                "name": "MIGUES"
            },
            {
                "name": "PARQUE DEL PLATA"
            },
            {
                "name": "SAN BAUTISTA"
            },
            {
                "name": "SAN JACINTO"
            },
            {
                "name": "DR. FRANCISCO SOCA"
            },
            {
                "name": "TOLEDO"
            },
            {
                "name": "MONTES"
            },
            {
                "name": "SAN JOSÉ DE CARRASCO"
            },
            {
                "name": "FRACC. SOBRE R.74"
            },
            {
                "name": "AGUAS CORRIENTES"
            },
            {
                "name": "BARRA DE CARRASCO"
            },
            {
                "name": "JUANICÓ"
            },
            {
                "name": "LA FLORESTA"
            },
            {
                "name": "ESTACIÓN LA FLORESTA"
            },
            {
                "name": "LAS TOSCAS"
            },
            {
                "name": "PARQUE CARRASCO"
            },
            {
                "name": "SALINAS"
            },
            {
                "name": "SAN ANTONIO"
            },
            {
                "name": "AEROP. INTERNACIONAL DE CARRASCO"
            },
            {
                "name": "SOLYMAR"
            },
            {
                "name": "VILLA AEROPARQUE"
            },
            {
                "name": "CAMINO A LA CADENA"
            },
            {
                "name": "CASTELLANOS"
            },
            {
                "name": "COLONIA BERRO"
            },
            {
                "name": "BARRIO CÓPOLA"
            },
            {
                "name": "COSTA AZUL"
            },
            {
                "name": "COSTA Y GUILLAMÓN"
            },
            {
                "name": "EL PINAR"
            },
            {
                "name": "ESTACIÓN MIGUES"
            },
            {
                "name": "PINAMAR - PINEPARK"
            },
            {
                "name": "LAGOMAR"
            },
            {
                "name": "OLMOS"
            },
            {
                "name": "PARADA CABRERA"
            },
            {
                "name": "SAN LUIS"
            },
            {
                "name": "SHANGRILÁ"
            },
            {
                "name": "TOTORAL DEL SAUCE"
            },
            {
                "name": "VILLA FELICIDAD"
            },
            {
                "name": "VILLA PAZ S.A."
            },
            {
                "name": "VILLA SAN JOSÉ"
            },
            {
                "name": "ESTACIÓN TAPIA"
            },
            {
                "name": "VILLA SAN FELIPE"
            },
            {
                "name": "VILLA HADITA"
            },
            {
                "name": "PASO DE PACHE"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "CITY GOLF"
            },
            {
                "name": "VIEJO MOLINO SAN BERNARDO"
            },
            {
                "name": "ESTANQUE DE PANDO"
            },
            {
                "name": "JARDINES DE PANDO"
            },
            {
                "name": "PASO ESPINOSA"
            },
            {
                "name": "ARAMINDA"
            },
            {
                "name": "ARGENTINO"
            },
            {
                "name": "BARRA DE LA PEDRERA"
            },
            {
                "name": "BARRANCAS COLORADAS"
            },
            {
                "name": "BELLO HORIZONTE"
            },
            {
                "name": "BIARRITZ"
            },
            {
                "name": "BOLÍVAR"
            },
            {
                "name": "CAMPO MILITAR"
            },
            {
                "name": "CAPILLA DE CELLA"
            },
            {
                "name": "CAÑADA DE CARDOZO"
            },
            {
                "name": "CERRILLOS AL SUR"
            },
            {
                "name": "COSTA DE PANDO"
            },
            {
                "name": "COSTA DE TALA"
            },
            {
                "name": "CRUZ DE LOS CAMINOS"
            },
            {
                "name": "CUCHILLA ALTA"
            },
            {
                "name": "CUCHILLA VERDE"
            },
            {
                "name": "CUEVA DEL TIGRE"
            },
            {
                "name": "ECHEVARRÍA"
            },
            {
                "name": "EL BOSQUE"
            },
            {
                "name": "EMPALME SAUCE"
            },
            {
                "name": "ESTACIÓN MARGAT"
            },
            {
                "name": "ESTACIÓN PEDRERA"
            },
            {
                "name": "FORTÍN DE SANTA ROSA"
            },
            {
                "name": "FRACC. PROGRESO"
            },
            {
                "name": "INSTITUTO ADVENTISTA"
            },
            {
                "name": "JAUREGUIBERRY"
            },
            {
                "name": "LA CAPILLA"
            },
            {
                "name": "LA LUCHA"
            },
            {
                "name": "LA MONTAÑESA"
            },
            {
                "name": "LA PALMITA"
            },
            {
                "name": "LA PALOMA"
            },
            {
                "name": "LA QUERENCIA"
            },
            {
                "name": "LOMAS DE SOLYMAR"
            },
            {
                "name": "LAS BARRERAS"
            },
            {
                "name": "LOS CERRILLOS"
            },
            {
                "name": "LOS TITANES"
            },
            {
                "name": "MARINDIA"
            },
            {
                "name": "NEPTUNIA"
            },
            {
                "name": "PARADOR TAJES"
            },
            {
                "name": "PASO DE LA CADENA"
            },
            {
                "name": "PASO DE LA PALOMA"
            },
            {
                "name": "PASO DE LAS TOSCAS"
            },
            {
                "name": "PASO DEL BOTE"
            },
            {
                "name": "PASO PALOMEQUE"
            },
            {
                "name": "PASO VILLAR"
            },
            {
                "name": "PIEDRA DEL TORO"
            },
            {
                "name": "ESTACIÓN PIEDRAS DE AFILAR"
            },
            {
                "name": "EL GALEÓN"
            },
            {
                "name": "PUNTAS DE PANTANOSO"
            },
            {
                "name": "SAN PEDRO"
            },
            {
                "name": "SANTA ANA"
            },
            {
                "name": "SANTA LUCÍA DEL ESTE"
            },
            {
                "name": "SANTOS LUGARES"
            },
            {
                "name": "SAUCE DE SOLÍS"
            },
            {
                "name": "SEIS HERMANOS"
            },
            {
                "name": "VILLA AREJO"
            },
            {
                "name": "VILLA ARGENTINA"
            },
            {
                "name": "VILLA ENCANTADA"
            },
            {
                "name": "VILLA GABI"
            },
            {
                "name": "VILLA NUEVA"
            },
            {
                "name": "VILLA PORVENIR"
            },
            {
                "name": "LA TUNA"
            },
            {
                "name": "GUAZÚ - VIRÁ"
            },
            {
                "name": "COLINAS DE SOLYMAR"
            },
            {
                "name": "BARRIO REMANSO"
            },
            {
                "name": "VILLA EL TATO"
            },
            {
                "name": "VILLA SAN CONO"
            },
            {
                "name": "VILLA JUANA"
            },
            {
                "name": "COLINAS DE CARRASCO"
            },
            {
                "name": "LOMAS DE CARRASCO"
            },
            {
                "name": "CARMEL"
            },
            {
                "name": "LA ASUNCIÓN"
            },
            {
                "name": "QUINTAS DEL BOSQUE"
            },
            {
                "name": "ALTOS DE LA TAHONA"
            },
            {
                "name": "ASENTAMIENTO R.6 KM 24.500"
            }
        ]
    },
    {
        "name": "CERRO LARGO",
        "cities": [
            {
                "name": "MELO"
            },
            {
                "name": "FRAILE MUERTO"
            },
            {
                "name": "RÍO BRANCO"
            },
            {
                "name": "TUPAMBAÉ"
            },
            {
                "name": "ISIDORO NOBLÍA"
            },
            {
                "name": "ACEGUÁ"
            },
            {
                "name": "BAÑADO DE MEDINA"
            },
            {
                "name": "CENTURIÓN"
            },
            {
                "name": "CERRO DE LAS CUENTAS"
            },
            {
                "name": "HIPÓDROMO"
            },
            {
                "name": "PASO PEREIRA"
            },
            {
                "name": "PLÁCIDO ROSAS"
            },
            {
                "name": "TOLEDO"
            },
            {
                "name": "TRES ISLAS"
            },
            {
                "name": "POBLADO URUGUAY"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "AGUIRRE"
            },
            {
                "name": "AMARILLO"
            },
            {
                "name": "ARBOLITO"
            },
            {
                "name": "ARÉVALO"
            },
            {
                "name": "BAÑADO DE SATURNINO"
            },
            {
                "name": "BUENA VISTA"
            },
            {
                "name": "CALERA DE RECALDE"
            },
            {
                "name": "CAMPAMENTO"
            },
            {
                "name": "CAÑADA GRANDE"
            },
            {
                "name": "CASERÍO LAS CAÑAS"
            },
            {
                "name": "CAÑITAS"
            },
            {
                "name": "COIMBRA"
            },
            {
                "name": "CRUZ DE PIEDRA"
            },
            {
                "name": "CUCHILLA CAMBOTA"
            },
            {
                "name": "CUCHILLA DE MELO"
            },
            {
                "name": "CUCHILLA DEL CARMEN"
            },
            {
                "name": "CUCHILLA PERALTA"
            },
            {
                "name": "DURAZNERO"
            },
            {
                "name": "ESCUELA DE AGRONOMÍA"
            },
            {
                "name": "ESPERANZA"
            },
            {
                "name": "GANEN"
            },
            {
                "name": "GARAO"
            },
            {
                "name": "GETULIO VARGAS"
            },
            {
                "name": "GUAZUNAMBÍ"
            },
            {
                "name": "LA CORONILLA"
            },
            {
                "name": "LA GLORIA"
            },
            {
                "name": "LA MICAELA"
            },
            {
                "name": "LA PEDRERA"
            },
            {
                "name": "LAGO MERÍN"
            },
            {
                "name": "LAGUNA DEL JUNCO"
            },
            {
                "name": "LAS LIMAS"
            },
            {
                "name": "MANGRULLO"
            },
            {
                "name": "MARÍA ISABEL"
            },
            {
                "name": "MEDEROS"
            },
            {
                "name": "MONTECITO"
            },
            {
                "name": "NANDO"
            },
            {
                "name": "PASO DE ALMADA"
            },
            {
                "name": "PASO DE LAS TROPAS"
            },
            {
                "name": "PASO DEL CENTURIÓN"
            },
            {
                "name": "PASO DE MELO"
            },
            {
                "name": "PICADA DE SALOMÉ"
            },
            {
                "name": "PIEDRA ALTA"
            },
            {
                "name": "PIÑEIRO"
            },
            {
                "name": "PUENTE DEL CHUY"
            },
            {
                "name": "PUNTAS DE TACUARÍ"
            },
            {
                "name": "QUEBRACHO"
            },
            {
                "name": "RAAB ARROCERA"
            },
            {
                "name": "RAMÓN TRIGO"
            },
            {
                "name": "RINCÓN DE PAIVA"
            },
            {
                "name": "RINCÓN DE CONTRERAS"
            },
            {
                "name": "RINCÓN DE LOS CORONELES"
            },
            {
                "name": "RINCÓN DE LOS MONTANA"
            },
            {
                "name": "RINCÓN DE LOS OLIVERA"
            },
            {
                "name": "RINCÓN DE PY"
            },
            {
                "name": "RODRÍGUEZ"
            },
            {
                "name": "SAN DIEGO"
            },
            {
                "name": "SAN SERVANDO"
            },
            {
                "name": "SANCHEZ"
            },
            {
                "name": "SARANDÍ DE ACEGUÁ"
            },
            {
                "name": "SOSA"
            },
            {
                "name": "SOTO GORO"
            },
            {
                "name": "TRES BOLICHES"
            },
            {
                "name": "BARRIO LÓPEZ BENÍTEZ"
            },
            {
                "name": "PUNTAS DE MINAS"
            },
            {
                "name": "ARROZAL CASARONE"
            },
            {
                "name": "PAJARO AZUL"
            },
            {
                "name": "BARRIO LA VINCHUCA"
            },
            {
                "name": "ARACHANIA"
            },
            {
                "name": "ÑANGAPIRE"
            }
        ]
    },
    {
        "name": "COLONIA",
        "cities": [
            {
                "name": "COLONIA DEL SACRAMENTO"
            },
            {
                "name": "CARMELO"
            },
            {
                "name": "JUAN LACAZE"
            },
            {
                "name": "NUEVA HELVECIA"
            },
            {
                "name": "ROSARIO"
            },
            {
                "name": "NUEVA PALMIRA"
            },
            {
                "name": "PASO ANTOLÍN"
            },
            {
                "name": "OMBÚES DE LAVALLE"
            },
            {
                "name": "TARARIRAS"
            },
            {
                "name": "COLONIA VALDENSE"
            },
            {
                "name": "FLORENCIO SÁNCHEZ"
            },
            {
                "name": "CONCHILLAS"
            },
            {
                "name": "CASERÍO EL CERRO"
            },
            {
                "name": "EL GENERAL"
            },
            {
                "name": "LA PAZ"
            },
            {
                "name": "RIACHUELO"
            },
            {
                "name": "JUAN CARLOS CASEROS"
            },
            {
                "name": "ISMAEL CORTINAS"
            },
            {
                "name": "AGRACIADA"
            },
            {
                "name": "BOCA DEL ROSARIO"
            },
            {
                "name": "BUENA HORA"
            },
            {
                "name": "COLONIA ESTRELLA"
            },
            {
                "name": "CUFRÉ"
            },
            {
                "name": "EL CAÑO"
            },
            {
                "name": "EL SEMILLERO"
            },
            {
                "name": "ESTACIÓN ESTANZUELA"
            },
            {
                "name": "JUAN GONZÁLEZ R 21KM 243 A 246"
            },
            {
                "name": "CERROS DE SAN JUAN"
            },
            {
                "name": "MARTÍN CHICO"
            },
            {
                "name": "MIGUELETE"
            },
            {
                "name": "PASTOREO"
            },
            {
                "name": "PIEDRA DE LOS INDIOS"
            },
            {
                "name": "SAN JUAN"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ANCHORENA"
            },
            {
                "name": "CAMPANA"
            },
            {
                "name": "ARTILLEROS"
            },
            {
                "name": "BARKER"
            },
            {
                "name": "BARRANCAS COLORADAS"
            },
            {
                "name": "EL ENSUEÑO"
            },
            {
                "name": "BARRIO HIPÓDROMO"
            },
            {
                "name": "BELGRANO NORTE"
            },
            {
                "name": "BELGRANO SUR"
            },
            {
                "name": "BLANCA ARENA"
            },
            {
                "name": "BRISAS DEL PLATA"
            },
            {
                "name": "CANTERAS DEL RIACHUELO"
            },
            {
                "name": "CERRO DE LAS ARMAS"
            },
            {
                "name": "CERROS NEGROS"
            },
            {
                "name": "COLONIA ARRUE"
            },
            {
                "name": "COLONIA COSMOPOLITA"
            },
            {
                "name": "COLONIA SARANDÍ"
            },
            {
                "name": "PARAJE MINUANO"
            },
            {
                "name": "COSTA DE COLLA AL ESTE"
            },
            {
                "name": "COSTA DE COLLA AL NORTE"
            },
            {
                "name": "COSTA DE NAVARRO"
            },
            {
                "name": "EL BAÑADO"
            },
            {
                "name": "EL CUADRO"
            },
            {
                "name": "JUAN GONZÁLEZ"
            },
            {
                "name": "LA LAGUNA"
            },
            {
                "name": "LAGUNITA"
            },
            {
                "name": "LOMAS DE CARMELO"
            },
            {
                "name": "LAS FLORES"
            },
            {
                "name": "LOS PINOS"
            },
            {
                "name": "MIGUELETE DE CONCHILLAS"
            },
            {
                "name": "MINAS DE TALCO DE NARANCIO"
            },
            {
                "name": "MOLLES DE MIGUELETE"
            },
            {
                "name": "CHICO TORINO"
            },
            {
                "name": "LA HORQUETA"
            },
            {
                "name": "PASO HOSPITAL"
            },
            {
                "name": "PASO QUICHO"
            },
            {
                "name": "PLAYA AZUL"
            },
            {
                "name": "PLAYA BRITÓPOLIS"
            },
            {
                "name": "PLAYA PARANT"
            },
            {
                "name": "PLAYA FOMENTO"
            },
            {
                "name": "POLANCO"
            },
            {
                "name": "PUERTO INGLÉS"
            },
            {
                "name": "PUERTO ROSARIO"
            },
            {
                "name": "PUNTA DE ARENALES"
            },
            {
                "name": "PUNTAS DE JUAN GONZÁLEZ"
            },
            {
                "name": "PUNTAS DEL ROSARIO (ZUNIN)"
            },
            {
                "name": "RADIAL HERNÁNDEZ"
            },
            {
                "name": "RADIAL ROSARIO"
            },
            {
                "name": "RESGUARDO CUFRÉ"
            },
            {
                "name": "ROSARIO Y COLLA"
            },
            {
                "name": "RUTA 21 KM 202"
            },
            {
                "name": "SAN LUIS"
            },
            {
                "name": "SAN LUIS SÁNCHEZ"
            },
            {
                "name": "SAN PEDRO"
            },
            {
                "name": "SAN ROQUE"
            },
            {
                "name": "SANTA ANA"
            },
            {
                "name": "SANTA REGINA"
            },
            {
                "name": "SANTA ROSA"
            },
            {
                "name": "SARANDÍ CAMPANA"
            },
            {
                "name": "TERMINAL - ARTILLEROS"
            },
            {
                "name": "TRES ESQUINAS"
            },
            {
                "name": "VÍBORAS"
            },
            {
                "name": "VÍBORAS OESTE"
            },
            {
                "name": "ZAGARZAZÚ"
            },
            {
                "name": "ARRIVILLAGA"
            },
            {
                "name": "PALO SOLO"
            },
            {
                "name": "EL FARO"
            },
            {
                "name": "LAGUNA DE LOS PATOS"
            },
            {
                "name": "JUAN JACKSON"
            },
            {
                "name": "PUEBLO GIL"
            },
            {
                "name": "CERRO CARMELO"
            },
            {
                "name": "EL QUINTÓN"
            }
        ]
    },
    {
        "name": "DURAZNO",
        "cities": [
            {
                "name": "DURAZNO"
            },
            {
                "name": "SARANDÍ DEL YÍ"
            },
            {
                "name": "CARMEN"
            },
            {
                "name": "BLANQUILLO"
            },
            {
                "name": "LA PALOMA"
            },
            {
                "name": "CARLOS REYLES"
            },
            {
                "name": "CENTENARIO"
            },
            {
                "name": "SANTA BERNARDINA"
            },
            {
                "name": "CERRO CHATO"
            },
            {
                "name": "BAYGORRIA"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ABELLA"
            },
            {
                "name": "AGUAS BUENAS"
            },
            {
                "name": "CHILENO"
            },
            {
                "name": "PUEBLO DE ÁLVAREZ"
            },
            {
                "name": "BARRANCAS COLORADAS"
            },
            {
                "name": "BATOVÍ"
            },
            {
                "name": "BELLACO"
            },
            {
                "name": "BLANQUILLO AL OESTE"
            },
            {
                "name": "CAPILLA FARRUCO"
            },
            {
                "name": "CARPINTERÍA"
            },
            {
                "name": "CEIBAL"
            },
            {
                "name": "CERREZUELO"
            },
            {
                "name": "CERRO CONVENTO"
            },
            {
                "name": "COSTA DE CUADRA"
            },
            {
                "name": "CUCHILLA DE RAMÍREZ"
            },
            {
                "name": "DE DIOS"
            },
            {
                "name": "EL PESCADO"
            },
            {
                "name": "ESTACIÓN CHILENO"
            },
            {
                "name": "ESTACIÓN PARISH"
            },
            {
                "name": "FELICIANO"
            },
            {
                "name": "FONSECA"
            },
            {
                "name": "LA ALEGRÍA"
            },
            {
                "name": "LA MAZAMORRA"
            },
            {
                "name": "LOS AGREGADOS"
            },
            {
                "name": "LOS AGÜERO"
            },
            {
                "name": "LAS CAÑAS"
            },
            {
                "name": "LOS ROJAS"
            },
            {
                "name": "MALBAJAR"
            },
            {
                "name": "MARÍA CEJAS"
            },
            {
                "name": "MOURIÑO"
            },
            {
                "name": "OMBÚES DE ORIBE"
            },
            {
                "name": "PARADA SUR KM 265"
            },
            {
                "name": "PASO DEL MEDIO LAS PALMAS"
            },
            {
                "name": "PUGLIA"
            },
            {
                "name": "PUNTA DE LAS FLORES"
            },
            {
                "name": "PUNTAS DE HERRERA"
            },
            {
                "name": "REYNOLDS"
            },
            {
                "name": "ROJAS"
            },
            {
                "name": "ROLÓN"
            },
            {
                "name": "ROSSELL Y RIUS"
            },
            {
                "name": "RUTA 5 KM 172"
            },
            {
                "name": "SALINAS"
            },
            {
                "name": "SALINAS CHICO"
            },
            {
                "name": "SAN JORGE"
            },
            {
                "name": "SAN JOSÉ DE LAS CAÑAS"
            },
            {
                "name": "SANDÚ CHICO"
            },
            {
                "name": "SARANDÍ DEL RÍO NEGRO"
            },
            {
                "name": "LAS PALMAS"
            }
        ]
    },
    {
        "name": "FLORES",
        "cities": [
            {
                "name": "TRINIDAD"
            },
            {
                "name": "ISMAEL CORTINAS"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ANDRESITO"
            },
            {
                "name": "ARENAL CHICO"
            },
            {
                "name": "COLONIA ALEMANA"
            },
            {
                "name": "EL TOTORAL"
            },
            {
                "name": "JUAN JOSÉ CASTRO"
            },
            {
                "name": "PUEBLITO PIEDRA"
            },
            {
                "name": "PUEBLO PINTOS"
            },
            {
                "name": "PUNTAS DE CHAMANGA"
            },
            {
                "name": "PUNTAS DE CORRAL DE PIEDRA"
            },
            {
                "name": "PUNTAS DE MARINCHO"
            },
            {
                "name": "PUNTAS DE SARANDÍ"
            },
            {
                "name": "PUNTAS DEL SAUCE"
            },
            {
                "name": "SAN GREGORIO"
            },
            {
                "name": "SANTA ADELAIDA"
            },
            {
                "name": "SANTA ELENA"
            },
            {
                "name": "TALAS DE MACIEL"
            },
            {
                "name": "LA CASILLA"
            },
            {
                "name": "CERRO COLORADO"
            }
        ]
    },
    {
        "name": "FLORIDA",
        "cities": [
            {
                "name": "FLORIDA"
            },
            {
                "name": "SARANDÍ GRANDE"
            },
            {
                "name": "CASUPÁ"
            },
            {
                "name": "CARDAL"
            },
            {
                "name": "FRAY MARCOS"
            },
            {
                "name": "VEINTICINCO DE AGOSTO"
            },
            {
                "name": "VEINTICINCO DE MAYO"
            },
            {
                "name": "ALEJANDRO GALLINAL"
            },
            {
                "name": "CAPILLA DEL SAUCE"
            },
            {
                "name": "LA CRUZ"
            },
            {
                "name": "NICO PÉREZ"
            },
            {
                "name": "CERRO CHATO"
            },
            {
                "name": "CHAMIZO"
            },
            {
                "name": "GOÑI"
            },
            {
                "name": "MENDOZA"
            },
            {
                "name": "MENDOZA CHICO"
            },
            {
                "name": "REBOLEDO"
            },
            {
                "name": "VALENTINES"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ARRAYÁN"
            },
            {
                "name": "BERRONDO"
            },
            {
                "name": "CHAMIZO CHICO"
            },
            {
                "name": "CHINGOLAS"
            },
            {
                "name": "COLONIA SÁNCHEZ"
            },
            {
                "name": "COSTA DE CHAMIZO GRANDE"
            },
            {
                "name": "ESTACIÓN PALERMO"
            },
            {
                "name": "ESTACIÓN URIOSTE"
            },
            {
                "name": "PUEBLO FERRER"
            },
            {
                "name": "FRIGORÍFICO MODELO"
            },
            {
                "name": "INDEPENDENCIA"
            },
            {
                "name": "JUNCAL"
            },
            {
                "name": "LAS CHILCAS"
            },
            {
                "name": "MANSAVILLAGRA"
            },
            {
                "name": "MOLLES DEL PESCADO"
            },
            {
                "name": "MONTECORAL"
            },
            {
                "name": "PASO DE LOS NOVILLOS"
            },
            {
                "name": "PINTADO"
            },
            {
                "name": "POLANCO DEL YÍ"
            },
            {
                "name": "PUEBLITO DE LAS ROSAS"
            },
            {
                "name": "PUEBLO DE LOS MOROCHOS"
            },
            {
                "name": "PUNTAS DE MACIEL"
            },
            {
                "name": "PUNTAS DE MANSAVILLAGRA"
            },
            {
                "name": "PUNTAS DE SARANDÍ"
            },
            {
                "name": "SAN PEDRO DEL TIMOTE"
            },
            {
                "name": "TALITA"
            },
            {
                "name": "VILLA HÍPICA"
            },
            {
                "name": "VILLA VIEJA"
            },
            {
                "name": "ILLESCAS"
            },
            {
                "name": "CASERÍO LA FUNDACIÓN"
            },
            {
                "name": "LA MACANA"
            },
            {
                "name": "ESTACIÓN CAPILLA DEL SAUCE"
            },
            {
                "name": "SAN GABRIEL"
            }
        ]
    },
    {
        "name": "LAVALLEJA",
        "cities": [
            {
                "name": "MINAS"
            },
            {
                "name": "JOSÉ BATLLE Y ORDÓÑEZ"
            },
            {
                "name": "JOSÉ PEDRO VARELA"
            },
            {
                "name": "MARISCALA"
            },
            {
                "name": "SOLÍS DE MATAOJO"
            },
            {
                "name": "PIRARAJÁ"
            },
            {
                "name": "ZAPICÁN"
            },
            {
                "name": "COLÓN"
            },
            {
                "name": "COSTAS DEL SOLDADO"
            },
            {
                "name": "POBLADO ARAMENDÍA"
            },
            {
                "name": "RUTA 40 KM 27,5"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "AGUAS BLANCAS"
            },
            {
                "name": "ALONSO"
            },
            {
                "name": "ANDREONI"
            },
            {
                "name": "BLANES VIALE"
            },
            {
                "name": "CARNALES"
            },
            {
                "name": "CERRO PELADO"
            },
            {
                "name": "COSTAS DEL LENGUAZO"
            },
            {
                "name": "19 DE JUNIO"
            },
            {
                "name": "EL SOLDADO"
            },
            {
                "name": "ESTACIÓN ORTIZ"
            },
            {
                "name": "ESTACIÓN SOLÍS"
            },
            {
                "name": "GAETÁN"
            },
            {
                "name": "GODOY"
            },
            {
                "name": "HIGUERITAS"
            },
            {
                "name": "LA PLATA"
            },
            {
                "name": "LADRILLOS"
            },
            {
                "name": "LAS ACHIRAS"
            },
            {
                "name": "MARCO DE LOS REYES"
            },
            {
                "name": "MARMARAJÁ"
            },
            {
                "name": "MOLLES DE GUTIÉRREZ"
            },
            {
                "name": "POBLADO LARROSA"
            },
            {
                "name": "POLANCO NORTE"
            },
            {
                "name": "POLANCO SUR"
            },
            {
                "name": "PUNTAS DE BARRIGA NEGRA"
            },
            {
                "name": "PUNTAS DE SANTA LUCÍA"
            },
            {
                "name": "RETAMOSA"
            },
            {
                "name": "RINCÓN DE MARISCALA"
            },
            {
                "name": "RINCÓN DE CEBOLLATÍ"
            },
            {
                "name": "RUTA 40 KM 25"
            },
            {
                "name": "SALUS"
            },
            {
                "name": "SARANDÍ DE GUTIÉRREZ"
            },
            {
                "name": "TAPES CHICO"
            },
            {
                "name": "TAPES GRANDE"
            },
            {
                "name": "VELÁZQUEZ"
            },
            {
                "name": "VILLA DEL ROSARIO"
            },
            {
                "name": "VILLA SERRANA"
            },
            {
                "name": "BARRIO LA CORONILLA - ANCAP"
            },
            {
                "name": "SAN FRANCISCO DE LAS SIERRAS"
            },
            {
                "name": "ILLESCAS"
            }
        ]
    },
    {
        "name": "MALDONADO",
        "cities": [
            {
                "name": "MALDONADO"
            },
            {
                "name": "SAN CARLOS"
            },
            {
                "name": "AIGUÁ"
            },
            {
                "name": "PAN DE AZÚCAR"
            },
            {
                "name": "PIRIÁPOLIS"
            },
            {
                "name": "PUNTA DEL ESTE"
            },
            {
                "name": "CERRO PELADO"
            },
            {
                "name": "GARZÓN"
            },
            {
                "name": "GERONA"
            },
            {
                "name": "LA SIERRA"
            },
            {
                "name": "LAS FLORES - ESTACIÓN"
            },
            {
                "name": "LOS TALAS"
            },
            {
                "name": "NUEVA CARRARA"
            },
            {
                "name": "SOLÍS"
            },
            {
                "name": "PUEBLO SOLÍS"
            },
            {
                "name": "PINARES - LAS DELICIAS"
            },
            {
                "name": "CHIHUAHUA"
            },
            {
                "name": "VILLA DELIA"
            },
            {
                "name": "SAN RAFAEL - EL PLACER"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ISLAS"
            },
            {
                "name": "ABRA DE CASTELLANOS"
            },
            {
                "name": "ABRA DE PERDOMO"
            },
            {
                "name": "BARRA DEL SAUCE"
            },
            {
                "name": "BARRIO HIPÓDROMO"
            },
            {
                "name": "BARRIO LOS AROMOS"
            },
            {
                "name": "BELLA VISTA"
            },
            {
                "name": "BUENOS AIRES"
            },
            {
                "name": "CALERA RAMOS"
            },
            {
                "name": "CANTERAS DE MARELLI"
            },
            {
                "name": "CARAPÉ"
            },
            {
                "name": "CERROS AZULES"
            },
            {
                "name": "CORONILLA"
            },
            {
                "name": "EDÉN ROCK"
            },
            {
                "name": "EL CHORRO"
            },
            {
                "name": "EL EDÉN"
            },
            {
                "name": "EL TESORO"
            },
            {
                "name": "ESTACIÓN JOSÉ IGNACIO"
            },
            {
                "name": "FARO JOSÉ IGNACIO"
            },
            {
                "name": "GREGORIO AZNÁREZ"
            },
            {
                "name": "GUARDIA VIEJA"
            },
            {
                "name": "LA BARRA"
            },
            {
                "name": "LA FALDA"
            },
            {
                "name": "LA CAPUERA"
            },
            {
                "name": "LAS FLORES"
            },
            {
                "name": "LOS CEIBOS"
            },
            {
                "name": "MANANTIALES"
            },
            {
                "name": "OCEAN PARK"
            },
            {
                "name": "PARTIDO NORTE"
            },
            {
                "name": "PARTIDO OESTE"
            },
            {
                "name": "PASO DE LOS TALAS"
            },
            {
                "name": "PICADA TOLOSA"
            },
            {
                "name": "PLAYA GRANDE"
            },
            {
                "name": "PLAYA HERMOSA"
            },
            {
                "name": "PLAYA VERDE"
            },
            {
                "name": "PUNTA BALLENA"
            },
            {
                "name": "PUNTA COLORADA"
            },
            {
                "name": "PUNTA NEGRA"
            },
            {
                "name": "PUNTAS DE SAN IGNACIO"
            },
            {
                "name": "RINCÓN DE LOS NÚÑEZ"
            },
            {
                "name": "RUTA 37 Y 9"
            },
            {
                "name": "RUTA 73 KM 101 A 102"
            },
            {
                "name": "RUTA 9 KM 86"
            },
            {
                "name": "SALAMANCA"
            },
            {
                "name": "SAN JUAN DEL ESTE"
            },
            {
                "name": "SANTA MÓNICA"
            },
            {
                "name": "SAUCE DE AIGUÁ"
            },
            {
                "name": "SAUCE DE PORTEZUELO"
            },
            {
                "name": "SAN VICENTE"
            },
            {
                "name": "BALNEARIO BUENOS AIRES"
            },
            {
                "name": "DE LOBOS"
            },
            {
                "name": "LAS CUMBRES"
            },
            {
                "name": "LOS CORCHOS"
            },
            {
                "name": "PARQUE MEDINA"
            },
            {
                "name": "ARENAS DE JOSÉ IGNACIO"
            },
            {
                "name": "LA SONRISA"
            },
            {
                "name": "EL QUIJOTE"
            },
            {
                "name": "LAGUNA BLANCA"
            }
        ]
    },
    {
        "name": "MONTEVIDEO",
        "cities": [
            {
                "name": "MONTEVIDEO"
            },
            {
                "name": "ABAYUBÁ"
            },
            {
                "name": "SANTIAGO VÁZQUEZ"
            },
            {
                "name": "PAJAS BLANCAS"
            },
            {
                "name": "RURAL"
            }
        ]
    },
    {
        "name": "PAYSANDU",
        "cities": [
            {
                "name": "PAYSANDÚ"
            },
            {
                "name": "GUICHÓN"
            },
            {
                "name": "NUEVO PAYSANDÚ"
            },
            {
                "name": "QUEBRACHO"
            },
            {
                "name": "TAMBORES"
            },
            {
                "name": "LORENZO GEYRES"
            },
            {
                "name": "MERINOS"
            },
            {
                "name": "PORVENIR"
            },
            {
                "name": "ALGORTA"
            },
            {
                "name": "ARBOLITO"
            },
            {
                "name": "BEISSO"
            },
            {
                "name": "CASABLANCA"
            },
            {
                "name": "CERRO CHATO"
            },
            {
                "name": "CONSTANCIA"
            },
            {
                "name": "MORATÓ"
            },
            {
                "name": "PIEDRAS COLORADAS"
            },
            {
                "name": "PIÑERA"
            },
            {
                "name": "PUNTAS DE BURICAYUPÍ"
            },
            {
                "name": "SAN FÉLIX"
            },
            {
                "name": "VILLA MARÍA (TIATUCURA)"
            },
            {
                "name": "PIEDRA SOLA"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ALONSO"
            },
            {
                "name": "ARAÚJO"
            },
            {
                "name": "BELLA VISTA"
            },
            {
                "name": "CAÑADA DEL PUEBLO"
            },
            {
                "name": "CHAPICUY"
            },
            {
                "name": "DAYMÁN"
            },
            {
                "name": "EL CHACO"
            },
            {
                "name": "EL EUCALIPTUS"
            },
            {
                "name": "EL HORNO"
            },
            {
                "name": "ESPERANZA"
            },
            {
                "name": "PUEBLO FEDERACIÓN"
            },
            {
                "name": "GUAYABOS"
            },
            {
                "name": "LA TENTACIÓN"
            },
            {
                "name": "LAS FLORES"
            },
            {
                "name": "ORGOROSO"
            },
            {
                "name": "PALMAR DEL QUEBRACHO"
            },
            {
                "name": "PANDULE"
            },
            {
                "name": "PASO DE LOS CARROS"
            },
            {
                "name": "QUEGUAY CHICO"
            },
            {
                "name": "RUTA 90 KM 36"
            },
            {
                "name": "SACACHISPAS"
            },
            {
                "name": "SAUCE DE ABAJO"
            },
            {
                "name": "CUCHILLA DE BURICAYUPÍ"
            },
            {
                "name": "SAUCE DEL QUEGUAY"
            },
            {
                "name": "SOTO"
            },
            {
                "name": "TOMÁS PAZ"
            },
            {
                "name": "VALDEZ"
            },
            {
                "name": "ZEBALLOS"
            },
            {
                "name": "CHACRAS DE PAYSANDÚ"
            },
            {
                "name": "RIVAS"
            },
            {
                "name": "GALLINAL"
            },
            {
                "name": "PUNTAS DE ARROYO NEGRO"
            },
            {
                "name": "ESTACIÓN PORVENIR"
            },
            {
                "name": "CUCHILLA DE FUEGO"
            },
            {
                "name": "PUEBLO ALONZO"
            },
            {
                "name": "QUEGUAYAR"
            },
            {
                "name": "TERMAS DE GUAVIYÚ"
            },
            {
                "name": "TERMAS DE ALMIRÓN"
            }
        ]
    },
    {
        "name": "RIO NEGRO",
        "cities": [
            {
                "name": "FRAY BENTOS"
            },
            {
                "name": "YOUNG"
            },
            {
                "name": "NUEVO BERLÍN"
            },
            {
                "name": "SAN JAVIER"
            },
            {
                "name": "BARRIO ANGLO"
            },
            {
                "name": "GRECCO"
            },
            {
                "name": "MERINOS"
            },
            {
                "name": "ALGORTA"
            },
            {
                "name": "EL OMBÚ"
            },
            {
                "name": "LOS RANCHOS"
            },
            {
                "name": "PASO DE LOS MELLIZOS"
            },
            {
                "name": "SARANDÍ DE NAVARRO"
            },
            {
                "name": "SAUCE"
            },
            {
                "name": "VILLA GENERAL BORGES"
            },
            {
                "name": "VILLA MARÍA"
            },
            {
                "name": "LAS CAÑAS"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ISLAS"
            },
            {
                "name": "ABRIGO"
            },
            {
                "name": "BELLACO"
            },
            {
                "name": "ISLAS DE ARGUELLO"
            },
            {
                "name": "LA ARENA"
            },
            {
                "name": "LA FLORIDA"
            },
            {
                "name": "LA ILERA"
            },
            {
                "name": "LA UNIÓN"
            },
            {
                "name": "LIEBIGS"
            },
            {
                "name": "LOS ARRAYANES"
            },
            {
                "name": "MATAOJO"
            },
            {
                "name": "MENAFRA"
            },
            {
                "name": "PALMAR GRANDE"
            },
            {
                "name": "PASO ARROYO DON ESTEBAN"
            },
            {
                "name": "PASO DE LOS COBRES"
            },
            {
                "name": "PASO DE SOCA"
            },
            {
                "name": "ROLÓN"
            },
            {
                "name": "SÁNCHEZ CHICO"
            },
            {
                "name": "SÁNCHEZ"
            },
            {
                "name": "SANTA ELISA"
            },
            {
                "name": "SANTA ROSA"
            },
            {
                "name": "SARANDÍ CHICO"
            },
            {
                "name": "TRES BOCAS"
            },
            {
                "name": "ULESTE"
            },
            {
                "name": "TRES QUINTAS"
            }
        ]
    },
    {
        "name": "RIVERA",
        "cities": [
            {
                "name": "RIVERA"
            },
            {
                "name": "MINAS DE CORRALES"
            },
            {
                "name": "TRANQUERAS"
            },
            {
                "name": "VICHADERO"
            },
            {
                "name": "SANTA TERESA"
            },
            {
                "name": "ABROJAL"
            },
            {
                "name": "ARROYO BLANCO"
            },
            {
                "name": "PASO ATAQUES"
            },
            {
                "name": "CERRO PELADO"
            },
            {
                "name": "CERRO CAQUEIRO"
            },
            {
                "name": "CHILCA DE CARAGUATÁ"
            },
            {
                "name": "CORTUME"
            },
            {
                "name": "CURTICEIRAS"
            },
            {
                "name": "CUÑAPIRÚ"
            },
            {
                "name": "PASO HOSPITAL"
            },
            {
                "name": "LAPUENTE"
            },
            {
                "name": "LAS FLORES"
            },
            {
                "name": "MOIRONES"
            },
            {
                "name": "PUNTAS DE CORRALES"
            },
            {
                "name": "SAN GREGORIO"
            },
            {
                "name": "LA PEDRERA"
            },
            {
                "name": "MANDUBÍ"
            },
            {
                "name": "LAGUNÓN"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ALBORADA"
            },
            {
                "name": "AMARILLO"
            },
            {
                "name": "BATOVÍ"
            },
            {
                "name": "BERRUTI"
            },
            {
                "name": "BLANQUILLOS"
            },
            {
                "name": "CAPÓN ALTO"
            },
            {
                "name": "CARPINTERÍA"
            },
            {
                "name": "CARPINTERÍA DE YAGUARÍ"
            },
            {
                "name": "CERRILLADA"
            },
            {
                "name": "CERRO ALEGRE"
            },
            {
                "name": "CERROS DE LA CALERA"
            },
            {
                "name": "CERROS BLANCOS DE CUÑAPIRÚ"
            },
            {
                "name": "CORONILLA"
            },
            {
                "name": "CORONILLA DE CORRALES"
            },
            {
                "name": "CRUZ DE SAN PEDRO"
            },
            {
                "name": "CUCHILLA DE TRES CERROS"
            },
            {
                "name": "CUCHILLA MANGUERAS"
            },
            {
                "name": "GUAVIYÚ"
            },
            {
                "name": "LA CHILCA"
            },
            {
                "name": "LAGOS DEL NORTE"
            },
            {
                "name": "LAURELES"
            },
            {
                "name": "MANUEL DÍAZ"
            },
            {
                "name": "MASOLLER"
            },
            {
                "name": "MINAS DE CUÑAPIRÚ"
            },
            {
                "name": "MINAS DE ZAPUCAY"
            },
            {
                "name": "PARADA MEDINA"
            },
            {
                "name": "PASO DE AMARILLO"
            },
            {
                "name": "PASO DE LOS ATAQUES"
            },
            {
                "name": "PASO DE SERPA"
            },
            {
                "name": "PASO DE TAPADO"
            },
            {
                "name": "PASO DEL PARQUE"
            },
            {
                "name": "PIEDRAS BLANCAS"
            },
            {
                "name": "PLATÓN"
            },
            {
                "name": "PUNTAS DE ABROJAL"
            },
            {
                "name": "RINCÓN DE RODRÍGUEZ"
            },
            {
                "name": "RINCÓN DE ROLAND"
            },
            {
                "name": "RINCÓN LOS TRES CERROS"
            },
            {
                "name": "RUBIO CHICO"
            },
            {
                "name": "SARANDÍ DE RÍO NEGRO"
            },
            {
                "name": "SAUZAL"
            },
            {
                "name": "VILLA INDART"
            },
            {
                "name": "YAGUARÍ"
            },
            {
                "name": "ZANJA HONDA 01"
            },
            {
                "name": "ZANJA HONDA 02"
            }
        ]
    },
    {
        "name": "ROCHA",
        "cities": [
            {
                "name": "ROCHA"
            },
            {
                "name": "CASTILLOS"
            },
            {
                "name": "LASCANO"
            },
            {
                "name": "CHUY"
            },
            {
                "name": "CEBOLLATÍ"
            },
            {
                "name": "VELÁZQUEZ"
            },
            {
                "name": "18 DE JULIO"
            },
            {
                "name": "LA PALOMA"
            },
            {
                "name": "SAN LUIS AL MEDIO"
            },
            {
                "name": "LA AGUADA Y COSTA AZUL"
            },
            {
                "name": "DIECINUEVE DE ABRIL"
            },
            {
                "name": "LA CORONILLA"
            },
            {
                "name": "PASO BARRANCAS"
            },
            {
                "name": "BARRIO PEREIRA"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ISLA"
            },
            {
                "name": "AGUAS DULCES"
            },
            {
                "name": "ARROZAL VICTORIA"
            },
            {
                "name": "BARRA DEL CHUY"
            },
            {
                "name": "BARRIO TORRES"
            },
            {
                "name": "BUENA VISTA"
            },
            {
                "name": "CABO POLONIO"
            },
            {
                "name": "CAPACHO"
            },
            {
                "name": "CERRO DE LOS ROCHA"
            },
            {
                "name": "COSTAS DEL CEIBO"
            },
            {
                "name": "CUCHILLA DE GARZÓN"
            },
            {
                "name": "CUCHILLA DE INDIA MUERTA"
            },
            {
                "name": "EL CANELÓN"
            },
            {
                "name": "EL CARACOL"
            },
            {
                "name": "EL CEIBO"
            },
            {
                "name": "EL CHIMANGO"
            },
            {
                "name": "ESTERO PELOTAS ARROCERA"
            },
            {
                "name": "ESTIVA DE CHAFALOTE"
            },
            {
                "name": "BARRA DE VALIZAS"
            },
            {
                "name": "LA ESMERALDA"
            },
            {
                "name": "LA PEDRERA"
            },
            {
                "name": "LAGUNITA"
            },
            {
                "name": "LA GARZAS"
            },
            {
                "name": "LOS TACURUSES ARROCERA"
            },
            {
                "name": "MENA"
            },
            {
                "name": "PALMAR"
            },
            {
                "name": "PARALLÉ"
            },
            {
                "name": "PARQUE NAC. DE SANTA TERESA"
            },
            {
                "name": "PASO DEL BAÑADO"
            },
            {
                "name": "PICADA TECHERA ARROCERA"
            },
            {
                "name": "POBLADO CORREA"
            },
            {
                "name": "PUERTO DE LOS BOTES"
            },
            {
                "name": "QUEBRACHO"
            },
            {
                "name": "RINCÓN DE NIETO"
            },
            {
                "name": "RINCÓN DE LOS OLIVERA"
            },
            {
                "name": "PUIMAYEN"
            },
            {
                "name": "TRES ISLAS"
            },
            {
                "name": "ARACHANIA"
            },
            {
                "name": "PTA. RUBIA Y STA. ISABEL DE LA\nPEDRERA"
            },
            {
                "name": "ATLÁNTICA"
            },
            {
                "name": "PUNTA DEL DIABLO"
            },
            {
                "name": "PALMARES DE LA CORONILLA"
            },
            {
                "name": "LA RIBIERA"
            },
            {
                "name": "PUENTE VALIZAS"
            },
            {
                "name": "OCEANÍA DEL POLONIO"
            },
            {
                "name": "PUEBLO NUEVO"
            },
            {
                "name": "TAJAMARES DE LA PEDRERA"
            },
            {
                "name": "SAN ANTONIO"
            }
        ]
    },
    {
        "name": "SALTO",
        "cities": [
            {
                "name": "SALTO"
            },
            {
                "name": "BELÉN"
            },
            {
                "name": "CONSTITUCIÓN"
            },
            {
                "name": "FERNÁNDEZ"
            },
            {
                "name": "SAN ANTONIO"
            },
            {
                "name": "CHACRAS DE BELÉN"
            },
            {
                "name": "ITAPEBÍ"
            },
            {
                "name": "ALBISU"
            },
            {
                "name": "BIASSINI"
            },
            {
                "name": "CAMPO DE TODOS"
            },
            {
                "name": "CAYETANO"
            },
            {
                "name": "CUCHILLA DE GUAVIYÚ"
            },
            {
                "name": "HIPÓDROMO"
            },
            {
                "name": "TERMAS DEL DAYMÁN"
            },
            {
                "name": "PALOMAS"
            },
            {
                "name": "PASO DEL PARQUE DEL DAYMÁN"
            },
            {
                "name": "QUINTANA"
            },
            {
                "name": "SARANDÍ DEL ARAPEY"
            },
            {
                "name": "SAUCEDO"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ALCAIN"
            },
            {
                "name": "ALVEZ"
            },
            {
                "name": "SOPAS"
            },
            {
                "name": "ARENITAS BLANCAS"
            },
            {
                "name": "BALTASAR BRUM"
            },
            {
                "name": "BORDENAVE"
            },
            {
                "name": "CANCELA"
            },
            {
                "name": "CANCELA O VARESSE"
            },
            {
                "name": "CARUMBÉ"
            },
            {
                "name": "CASCO"
            },
            {
                "name": "CELESTE"
            },
            {
                "name": "CERRILLADA"
            },
            {
                "name": "CERRILLADA DE SAUCEDO"
            },
            {
                "name": "CERRO CHATO"
            },
            {
                "name": "CERROS DE VERA"
            },
            {
                "name": "EL ESPINILLAR"
            },
            {
                "name": "FARÍAS"
            },
            {
                "name": "FERREIRA"
            },
            {
                "name": "GARIBALDI"
            },
            {
                "name": "LA BOLSA"
            },
            {
                "name": "LA BOLSA 02"
            },
            {
                "name": "LA BOLSA 03"
            },
            {
                "name": "TERMAS DEL ARAPEY"
            },
            {
                "name": "LAS FLORES"
            },
            {
                "name": "LAURELES"
            },
            {
                "name": "LLUVERAS"
            },
            {
                "name": "MARIO RUBIO"
            },
            {
                "name": "MATAOJITO"
            },
            {
                "name": "MIGLIARO"
            },
            {
                "name": "OLIVERA"
            },
            {
                "name": "PARADA HERRERÍA"
            },
            {
                "name": "PASO DE LAS CAÑAS"
            },
            {
                "name": "PASO DEL TROPERO"
            },
            {
                "name": "PASO DEL TAPADO"
            },
            {
                "name": "PASO NUEVO DEL ARAPEY"
            },
            {
                "name": "PEPE NÚÑEZ"
            },
            {
                "name": "PASO DE LAS PIEDRAS DE ARERUNGUÁ"
            },
            {
                "name": "PUNTAS DE CAÑAS"
            },
            {
                "name": "PUNTAS DE VALENTÍN"
            },
            {
                "name": "RAMOS"
            },
            {
                "name": "SARANDÍ"
            },
            {
                "name": "SAUCE CHICO"
            },
            {
                "name": "SOTO"
            },
            {
                "name": "TORO NEGRO"
            },
            {
                "name": "RINCÓN DE VALENTÍN"
            },
            {
                "name": "COLONIA 18 DE JULIO"
            },
            {
                "name": "SANTA ANA"
            },
            {
                "name": "ARAPEY"
            },
            {
                "name": "PARQUE JOSÉ LUIS"
            },
            {
                "name": "COLONIA ITAPEBÍ"
            },
            {
                "name": "GUAVIYÚ DE ARAPEY"
            },
            {
                "name": "RUSSO"
            },
            {
                "name": "PASO CEMENTERIO"
            },
            {
                "name": "OSIMANI Y LLERENA"
            }
        ]
    },
    {
        "name": "SAN JOSE",
        "cities": [
            {
                "name": "SAN JOSÉ DE MAYO"
            },
            {
                "name": "LIBERTAD"
            },
            {
                "name": "DELTA DEL TIGRE Y VILLAS"
            },
            {
                "name": "RODRÍGUEZ"
            },
            {
                "name": "ITUZAINGÓ"
            },
            {
                "name": "SANTA MÓNICA"
            },
            {
                "name": "ISMAEL CORTINAS"
            },
            {
                "name": "PUNTAS DE VALDEZ"
            },
            {
                "name": "GONZÁLEZ"
            },
            {
                "name": "MAL ABRIGO"
            },
            {
                "name": "PLAYA PASCUAL"
            },
            {
                "name": "18 DE JULIO (PUEBLO NUEVO)"
            },
            {
                "name": "RAFAEL PERAZA"
            },
            {
                "name": "RAIGÓN"
            },
            {
                "name": "TALA DE PEREIRA"
            },
            {
                "name": "SAFICI (PARQUE POSTEL)"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ARROYO LLANO"
            },
            {
                "name": "BELLA VISTA"
            },
            {
                "name": "JUAN SOLER"
            },
            {
                "name": "BOCAS DEL CUFRÉ"
            },
            {
                "name": "CAPURRO"
            },
            {
                "name": "VILLA MARÍA"
            },
            {
                "name": "COLONIA AMÉRICA"
            },
            {
                "name": "CUCHILLA DEL VICHADERO"
            },
            {
                "name": "ECILDA PAULLIER"
            },
            {
                "name": "ESCUDERO"
            },
            {
                "name": "FAJINA"
            },
            {
                "name": "KIYÚ - ORDEIG"
            },
            {
                "name": "LA BOYADA"
            },
            {
                "name": "LA BOYADA RUTA1 KM 91,2"
            },
            {
                "name": "LA CANDELARIA"
            },
            {
                "name": "LA CUCHILLA"
            },
            {
                "name": "ORDEIG"
            },
            {
                "name": "PAVÓN"
            },
            {
                "name": "CAÑADA GRANDE"
            },
            {
                "name": "PUNTAS DE GREGORIO"
            },
            {
                "name": "PUNTAS DE LAUREL"
            },
            {
                "name": "RAPETTI"
            },
            {
                "name": "RINCÓN DE NAZARET"
            },
            {
                "name": "RINCÓN DE BUSCHENTAL"
            },
            {
                "name": "RINCÓN DEL PINO"
            },
            {
                "name": "SAN GREGORIO"
            },
            {
                "name": "SCAVINO"
            },
            {
                "name": "TROPAS VIEJAS"
            },
            {
                "name": "VALDEZ CHICO"
            },
            {
                "name": "MONTE GRANDE"
            },
            {
                "name": "AGUAS CORRIENTES"
            },
            {
                "name": "CERÁMICAS DEL SUR"
            },
            {
                "name": "RADIAL"
            },
            {
                "name": "COLÓLÓ - TINOSA"
            },
            {
                "name": "MANGRULLO"
            },
            {
                "name": "CARRETA QUEMADA"
            },
            {
                "name": "COSTAS DE PEREIRA"
            },
            {
                "name": "COLONIA DELTA"
            }
        ]
    },
    {
        "name": "SORIANO",
        "cities": [
            {
                "name": "MERCEDES"
            },
            {
                "name": "DOLORES"
            },
            {
                "name": "CARDONA"
            },
            {
                "name": "JOSÉ ENRIQUE RODÓ"
            },
            {
                "name": "PALMITAS"
            },
            {
                "name": "VILLA SORIANO"
            },
            {
                "name": "PALMAR"
            },
            {
                "name": "EGAÑA"
            },
            {
                "name": "SANTA CATALINA"
            },
            {
                "name": "ISMAEL CORTINAS"
            },
            {
                "name": "AGRACIADA"
            },
            {
                "name": "CAÑADA PARAGUAYA"
            },
            {
                "name": "CASTILLOS"
            },
            {
                "name": "RISSO"
            },
            {
                "name": "SACACHISPAS"
            },
            {
                "name": "CAÑADA NIETO"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ISLAS"
            },
            {
                "name": "ARROYO GRANDE"
            },
            {
                "name": "BEQUELÓ RUTA 14 KM 4"
            },
            {
                "name": "BEQUELÓ RUTA 14 KM 7"
            },
            {
                "name": "BIZCOCHO"
            },
            {
                "name": "CALVO"
            },
            {
                "name": "COLONIA DÍAZ"
            },
            {
                "name": "CUCHILLA DEL PERDIDO"
            },
            {
                "name": "EL TALA"
            },
            {
                "name": "JACKSON"
            },
            {
                "name": "LA CONCORDIA"
            },
            {
                "name": "LA LOMA"
            },
            {
                "name": "OLIVERA"
            },
            {
                "name": "PAMER"
            },
            {
                "name": "RINCÓN DE COLÓLÓ"
            },
            {
                "name": "SAN DIOS"
            },
            {
                "name": "SAN MARTÍN"
            },
            {
                "name": "SARANDÍ CHICO"
            },
            {
                "name": "ZANJA HONDA"
            },
            {
                "name": "PALO SOLO"
            },
            {
                "name": "CHACRAS DE DOLORES"
            },
            {
                "name": "COLONIA CONCORDIA"
            },
            {
                "name": "PERSEVERANO"
            },
            {
                "name": "LARES"
            }
        ]
    },
    {
        "name": "TACUAREMBO",
        "cities": [
            {
                "name": "TACUAREMBÓ"
            },
            {
                "name": "PASO DE LOS TOROS"
            },
            {
                "name": "SAN GREGORIO DE POLANCO"
            },
            {
                "name": "TAMBORES"
            },
            {
                "name": "ACHAR"
            },
            {
                "name": "ANSINA"
            },
            {
                "name": "CURTINA"
            },
            {
                "name": "PASO DEL CERRO"
            },
            {
                "name": "RINCÓN DE MARTINOTE"
            },
            {
                "name": "CLARA"
            },
            {
                "name": "CLAVIJO"
            },
            {
                "name": "CUCHILLA DE CARAGUATÁ"
            },
            {
                "name": "CUCHILLA DEL OMBÚ"
            },
            {
                "name": "LA HILERA"
            },
            {
                "name": "LAS TOSCAS"
            },
            {
                "name": "PASO BONILLA"
            },
            {
                "name": "PUEBLO DE ARRIBA"
            },
            {
                "name": "PUEBLO DEL BARRO"
            },
            {
                "name": "RINCÓN DE LA ALDEA"
            },
            {
                "name": "RINCÓN DEL BONETE"
            },
            {
                "name": "BALNEARIO IPORÁ"
            },
            {
                "name": "ZAPARÁ"
            },
            {
                "name": "LOS RODRÍGUEZ"
            },
            {
                "name": "PIEDRA SOLA"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ALDEA SAN JOAQUÍN"
            },
            {
                "name": "ATAQUES"
            },
            {
                "name": "BAÑADO DE ROCHA"
            },
            {
                "name": "CARDOZO"
            },
            {
                "name": "CARDOZO CHICO"
            },
            {
                "name": "CERRO DE LA VENTANA"
            },
            {
                "name": "CHAMBERLAIN"
            },
            {
                "name": "COLMAN"
            },
            {
                "name": "CUCHILLA DE LA PALMA"
            },
            {
                "name": "CUCHILLA DE PERALTA"
            },
            {
                "name": "HERIBERTO"
            },
            {
                "name": "LA ALDEA"
            },
            {
                "name": "LA BOLSA 01"
            },
            {
                "name": "LA BOLSA 02"
            },
            {
                "name": "LA HUMEDAD"
            },
            {
                "name": "LA PEDRERA"
            },
            {
                "name": "LA ROSADA"
            },
            {
                "name": "LAMBARÉ"
            },
            {
                "name": "LARRAYOS"
            },
            {
                "name": "LAS ARENAS"
            },
            {
                "name": "LA CHIRCAS"
            },
            {
                "name": "LOS FEOS"
            },
            {
                "name": "LOS FERREIRA"
            },
            {
                "name": "LOS GARCÍA"
            },
            {
                "name": "LOS GÓMEZ"
            },
            {
                "name": "LOS MAGARIÑOS"
            },
            {
                "name": "LOS NOVILLOS"
            },
            {
                "name": "LAURELES"
            },
            {
                "name": "LOS ORTIZ"
            },
            {
                "name": "LOS ROSANOS"
            },
            {
                "name": "LOS ROSAS"
            },
            {
                "name": "LOS SEMPER"
            },
            {
                "name": "LOS VÁZQUEZ"
            },
            {
                "name": "LAURA"
            },
            {
                "name": "MATUTINA"
            },
            {
                "name": "MINUANO"
            },
            {
                "name": "MONTEVIDEO CHICO"
            },
            {
                "name": "PASO DE CEFERINO"
            },
            {
                "name": "PASO DE LAS CARRETAS"
            },
            {
                "name": "PASO DEL MEDIO"
            },
            {
                "name": "PICADA DE CUELLO"
            },
            {
                "name": "QUIEBRA YUGOS"
            },
            {
                "name": "CERRO DE PASTOREO"
            },
            {
                "name": "RINCÓN DE LA LAGUNA"
            },
            {
                "name": "RINCÓN DE GILOCA"
            },
            {
                "name": "RINCÓN DE FREITAS"
            },
            {
                "name": "RIVERA CHICO"
            },
            {
                "name": "SANTA RITA"
            },
            {
                "name": "SANTANDER"
            },
            {
                "name": "SAUCE DE BATOVÍ"
            },
            {
                "name": "SAUCE DE TRANQUERAS"
            },
            {
                "name": "SAUCE SOLO 02"
            },
            {
                "name": "TREINTA Y TRES Ó CAÑAS"
            },
            {
                "name": "TRES GUITARRAS"
            },
            {
                "name": "TURUPÍ"
            },
            {
                "name": "VALLE EDÉN"
            },
            {
                "name": "ZAPUCAY"
            },
            {
                "name": "CAPÓN DE LA YERBA"
            },
            {
                "name": "PUNTAS DE CINCO SAUCES"
            },
            {
                "name": "RINCÓN DE PEREIRA"
            },
            {
                "name": "PUNTA DE CARRETERA"
            },
            {
                "name": "CRUZ DE LOS CAMINOS"
            }
        ]
    },
    {
        "name": "TREINTA Y TRES",
        "cities": [
            {
                "name": "TREINTA Y TRES"
            },
            {
                "name": "SANTA CLARA DE OLIMAR"
            },
            {
                "name": "VERGARA"
            },
            {
                "name": "ARROZAL TREINTA Y TRES"
            },
            {
                "name": "GRAL. ENRIQUE MARTÍNEZ"
            },
            {
                "name": "VILLA SARA"
            },
            {
                "name": "CERRO CHATO"
            },
            {
                "name": "ESTACIÓN RINCÓN"
            },
            {
                "name": "ISLA PATRULLA (MARÍA ISABEL)"
            },
            {
                "name": "PICADA TECHERA"
            },
            {
                "name": "VALENTINES"
            },
            {
                "name": "RURAL"
            },
            {
                "name": "ACOSTA"
            },
            {
                "name": "POBLADO ALONZO"
            },
            {
                "name": "ARROZAL FLORENCIO BARRETO"
            },
            {
                "name": "ARROCERA RINCÓN"
            },
            {
                "name": "ARROZAL SANTA MARÍA"
            },
            {
                "name": "BAÑADO DE LOS OLIVERA"
            },
            {
                "name": "CAÑADA CHICA"
            },
            {
                "name": "CAÑADA DE LOS CUERVOS"
            },
            {
                "name": "CERROS DE AMARO"
            },
            {
                "name": "CIPA OLIMAR"
            },
            {
                "name": "CIPA SECADOR"
            },
            {
                "name": "COSTA DEL ARROYO MALO"
            },
            {
                "name": "CUCHILLA DE DIONISIO"
            },
            {
                "name": "EMBARQUE ARROZAL TREINTA Y TRES"
            },
            {
                "name": "JULIO MARÍA SANZ"
            },
            {
                "name": "LA CALAVERA"
            },
            {
                "name": "LA LATA"
            },
            {
                "name": "LECHIGUANA DE CORRALES"
            },
            {
                "name": "ARROCERA LOS CEIBOS"
            },
            {
                "name": "MARÍA ALBINA"
            },
            {
                "name": "MENDIZÁBAL (EL ORO)"
            },
            {
                "name": "PASO DE PÍRIZ"
            },
            {
                "name": "PASTOR"
            },
            {
                "name": "POBLADO MEDINA"
            },
            {
                "name": "PUNTAS DEL PARAO"
            },
            {
                "name": "RINCÓN DE GADEA"
            },
            {
                "name": "RINCÓN DE LOS FRANCOS"
            },
            {
                "name": "SAN JUAN"
            },
            {
                "name": "SIERRA DEL YERBAL"
            },
            {
                "name": "SIETE CASAS"
            },
            {
                "name": "TRES BOCAS"
            },
            {
                "name": "VERDE ALTO"
            },
            {
                "name": "VILLA PASSANO"
            },
            {
                "name": "EJIDO DE TREINTA Y TRES"
            },
            {
                "name": "EL BELLACO"
            },
            {
                "name": "ARROCERA LOS TEROS"
            },
            {
                "name": "ARROCERA BONOMO"
            },
            {
                "name": "ARROCERA EL TIGRE"
            },
            {
                "name": "ARROCERA LA CATUMBERA"
            },
            {
                "name": "ARROCERA LA QUERENCIA"
            },
            {
                "name": "ARROCERA LAS PALMAS"
            },
            {
                "name": "ARROCERA MINI"
            },
            {
                "name": "ARROCERA PROCIPA"
            },
            {
                "name": "ARROCERA SAN FERNANDO"
            },
            {
                "name": "ARROCERA SANTA FE"
            },
            {
                "name": "ARROCERA ZAPATA"
            }
        ]
    }
];

async function seedDepartments() {
    const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
    const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;
    try {
        await mongoose.connect(
            `${MONGODB_CONNECTION_STRING}/${MONGODB_DATABASE_NAME}`,
            {
                serverSelectionTimeoutMS: 5000,
            }
        );
        console

        console.log('Conectado a la base de datos.');

        for (const department of departments) {
            await Department.findOneAndUpdate(
                { name: department.name },
                { name: department.name, cities: department.cities },
                { upsert: true, new: true }
            );
        }

        console.log('Departamentos y ciudades insertados correctamente.');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error al insertar departamentos y ciudades:', error);
        mongoose.disconnect();
    }
}

seedDepartments();