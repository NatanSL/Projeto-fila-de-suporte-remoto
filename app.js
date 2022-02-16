const express = require("express");
const res = require("express/lib/response");
const app = express();
const dotenv = require('dotenv').config();
const port = 5000; 
const key = process.env.KEY;
const axios = require('axios');
const { engine } = require("express-handlebars");

//config handlebars
app.engine('handlebars', engine({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', './views');

//Files Statics
app.use(express.static('public'));

//Routes
app.get('/', async (req,res) => {

   
    //Consult API   
    const data = await axios(`https://cosmoserp.com/zhaz/aWSPCosmosFBX.aspx?${key},vApiOS,3`);    
    const suporte = data.data;  
    let dados = {dado: []};

    for(var i = 0; i < suporte.length; i++) {
        var descricao = suporte[i].DescricaoTipoOS;
        if(descricao == "SUPORTE REMOTO") {
            dados.dado.push({
                OS: suporte[i].OSID,
                Data_abertura: suporte[i].OSData,
                Cliente: suporte[i].PessoaFantasia,
                Vendedor: suporte[i].AgenteNegNome,
                Equipamento: suporte[i].NomeEquipamento,
                NS: suporte[i].EquipamentoLTS,
                Data_Movimento: suporte[i].DataFinalMovto
            });
        }
    }   
    // res.json(dados.dado);

    const active = "active";
    const desactive = "";

    res.render('emAbertos', {active, desactive})
    console.log(dados.dado)
    
    
})


app.get('/finalizados', async (req,res)  =>{

    //Consult API
    const data2 = await axios(`https://cosmoserp.com/zhaz/aWSPCosmosFBX.aspx?${key},vApiOS,14`);
    const finalizados = data2.data;
    let dadosFinalizados = {dado: []};

    for (var i = 0; i < finalizados.length; i++){
        var descricao = finalizados[i].DescricaoTipoOS;
        if (descricao == "SUPORTE REMOTO") {
           dadosFinalizados.dado.push({
            OS: finalizados[i].OSID,
            Data_abertura: finalizados[i].OSData,
            Cliente: finalizados[i].PessoaFantasia,
            Vendedor: finalizados[i].AgenteNegNome,
            Equipamento: finalizados[i].NomeEquipamento,
            NS: finalizados[i].EquipamentoLTS
           });
        }         
    }
    // res.json(dadosFinalizados.dado);
    const active = "desactive";
    const desactive = "active";
    
    res.render('finalizados', {active, desactive});
});



app.get('/home', (req, res) => {
     //renderizar
    res.render('home');   
});

app.listen(port, (err) => {
  try {
      console.log("server is running http://localhost:" + port);
  } catch (error) {
      console.log("Error:" + error);
  }  
})





// https://cosmoserp.com/zhaz/aWSPCosmosFBX.aspx?f2117e5dfa7f998f93afd92547d0ba9b,vApiOS,4