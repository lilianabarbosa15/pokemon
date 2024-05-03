const apiUrl = 'https://pokeapi.co/api/v2/pokemon/'; //URL de la API
let nombreEvolucion = '';

async function consultarApi(url){
    /*
    Función asincrona que recibe la apiUrl junto al valor que se requiere buscar
    y la clave con el fin de retornar los datos encontrados en el servidor, si
    encuentra un error muestra un mensaje en la página.
    */
    try{
        const response = await axios.get(url);
        return response.data;
    }catch(error){
        console.error(`fallo en la consulta a la api: ${error}`);
        "Se muestra el error y se oculta la información"
        updateWindow(false,"");
    }
}

/*Actualiza la pantalla*/
function updateWindow(state, name){
    /*
    Recibe una variable booleana donde si es true se actualiza con la
    información nueva del servidor mientras que si es false muestra en
    pantalla que los datos no pudieron ser cargados.
    */
    //Se limpia la pantalla de algún error anterior:
    const contError = document.querySelector('.containerError');
    const contDish = document.querySelector('.containerInfo');
    const contEvolucion = document.querySelector(".containerEvolution");
    if (state){
        contError.style.display = 'none';
        contDish.style.display = 'inline-block';
        if(name==""){
            console.log("no evoluciona")
            contEvolucion.style.display='none';
        }else{
            console.log(name);
            contEvolucion.style.display='inline-block';
        }
    }else{   //hubo error
        contError.style.display = 'inline-block';
        contDish.style.display = 'none';
        nombreEvolucion = '';
        contEvolucion.style.display='none';
    }
   
}

/*Verificación de pokemon ingresado*/
async function verifPokemon(url,input){
    /*
    Función asincrona que recibe la base de datos general y revisa si el pokemon ingresado
    se encuentra allí.
    */
    const datos = await consultarApi(url+input);
    console.log(datos);
    if(datos===undefined){
        updateWindow(false, "");
    }else{
        obtenerDatos(url+input);
    }
}

async function obtenerDatos(url){
    /*
    Función asincrona que recibe una dirección y le pide los datos (ya que es un
    servidor), con el fin de modificar la apariencia de la página con la
    información encontrada.
    */
    "Se solicitan los datos al servidor"
    const datos = await consultarApi(url);
    //Nombre:
    const Nombre = datos.species.name;
    //Foto:
    let Foto = datos.sprites.front_default; //.other.official-artwork.front_default;
    console.log(Foto)
    //Tipo: 
    const Tipo = new Array();
    for(let index in datos.types){
        Tipo.push(datos.types[index].type.name);
    }
    let TipoStr = "";
    for(let t in Tipo){
        TipoStr += String(Tipo[t]);
        if(parseInt(t)+1!=Tipo.length){
            TipoStr += ", ";
        }
    }
    //Descripción:
    let Descripcion = new String;
    const datosDescripcion = await consultarApi(datos.species.url);
    let contador = 0
    for(let index in datosDescripcion.flavor_text_entries){
        if(datosDescripcion.flavor_text_entries[index].language.name==="es"){
            //console.log(datosDescripcion.flavor_text_entries[index].language);
            if(contador===0 || contador===6){
                let aux = (datosDescripcion.flavor_text_entries[index].flavor_text).replaceAll('\n', " ")
                Descripcion += aux + " ";
            }
            contador++;
        }
    }
    //Habilidades:
    const Habilidades = new Array();
    for (let index in datos.abilities){
        Habilidades.push(datos.abilities[index].ability.name);
    }
    let HabilidadesStr = "";
    for(let h in Habilidades){
        HabilidadesStr += String(Habilidades[h]);
        if(parseInt(h)+1 != Habilidades.length){
            HabilidadesStr += ", ";
        }
    }
    "Se actualiza la información"
    const newName = document.querySelector(".pokemonName");
    newName.innerHTML=Nombre;
    const newImage = document.querySelector(".pokemonImg");
    newImage.src=Foto;
    const newTipo = document.querySelector(".pokemonType");
    newTipo.innerHTML=TipoStr;
    const newDescrip = document.querySelector(".pokemonDescrition");
    newDescrip.innerHTML=Descripcion;
    const newHabilidad = document.querySelector(".pokemonAbilities");
    newHabilidad.innerHTML=HabilidadesStr;
    "Se muestra el botón evolucionar si así es el caso"
    evolucionarPokemon(datos.species.url, Nombre);
}

async function evolucionarPokemon(url, name){
    /*
    Función que recibe la url que contiene el resto de información
    a saberse si es candidato a evolucionar, guarda el nombre del próximo
    pokemón y muestra el botón.
    */
    nombreEvol = "";
   console.log(url);
   "Se solicitan los datos al servidor"
   const datos = await consultarApi(url);
   console.log(datos.evolution_chain.url);
   const datosEvol = await consultarApi(datos.evolution_chain.url);

   if(datosEvol.chain.species.name==name && datosEvol.chain.evolves_to.length==0){
    console.log("no evolución");
    nombreEvol = "";
   }else if(datosEvol.chain.species.name==name){
    console.log("evol: ", datosEvol.chain.evolves_to[0].species.name);
    nombreEvol = datosEvol.chain.evolves_to[0].species.name;
   } else{
    if(datosEvol.chain.evolves_to[0].species.name == name && datosEvol.chain.evolves_to[0].evolves_to.length==0){
        console.log("no evolución");
        nombreEvol = "";
    }else if(datosEvol.chain.evolves_to[0].species.name==name){
        console.log("evol: ", datosEvol.chain.evolves_to[0].evolves_to[0].species.name);
        nombreEvol = datosEvol.chain.evolves_to[0].evolves_to[0].species.name;
    }else{

        if(datosEvol.chain.evolves_to[0].evolves_to[0].species.name == name && datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to.length==0){
            console.log("no evolución");
            nombreEvol = "";
        }else if(datosEvol.chain.evolves_to[0].evolves_to[0].species.name==name){
            console.log("evol: ", datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name);
            nombreEvol = datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name;
        }else{
            if(datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name == name && datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].evolves_to.length==0){
                console.log("no evolución");
                nombreEvol = "";
            }else if(datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name==name){
                console.log("evol: ", datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].evolves_to[0].species.name);
                nombreEvol = datosEvol.chain.evolves_to[0].evolves_to[0].evolves_to[0].evolves_to[0].species.name;
            }
        }
    }
   }
   nombreEvolucion = nombreEvol;
   "Se muestra la información"
   updateWindow(true, nombreEvol);
}






/*Captura datos*/
const searchButton = document.querySelector('.buttonSearch');
const searchInput = document.querySelector('#in1');
searchButton.addEventListener( /*Se agrega CallBack, función que se ejecuta en el momento del evento*/
    "click", () => { /*Función anonima para obtener datos del plato*/
        let inputData = String(searchInput.value);
        verifPokemon(apiUrl,inputData)
    }
)

const evolButton = document.querySelector('.buttonEvolution');
evolButton.addEventListener( /*Se agrega CallBack, función que se ejecuta en el momento del evento*/
    "click", () => { /*Función anonima para obtener datos del plato*/
        obtenerDatos(apiUrl+nombreEvolucion);
    }
)
