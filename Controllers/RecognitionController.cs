using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using Microsoft.AspNetCore.Http;
using FaceApi.Services;
using Models;
using System.IO;

namespace FaceApi.Controllers
{
  [Route("api/[controller]")]
  public class RecognitionController : Controller
  {
    private readonly FaceAPI face;
    public RecognitionController(FaceAPI face) => this.face = face;

    //Creo un grupo de personas, se indica en la url el identificador de ese grupo. Ej: visitas, se envía también un name o nombre por JSON
    [HttpPut("groups/{personGroupId}")]
    public Object CreateGroup(string personGroupId, Group group) => face.CreateFaceGroup(personGroupId, group.name);

    //Elimino el grupo a través de su identificador
    [HttpDelete("groups/{personGroupId}")]
    public Object DeleteGroup(string personGroupId) => face.DeleteFaceGroup(personGroupId);

    //Obtengo todos los grupos
    [HttpGet("groups")]
    public Object GetGroups() => face.GetFaceGroups();

    //Creo una persona indicando el grupo al que pertenecerá y un identificador/Nombre. Devuelve su identificador único
    [HttpPost("people/{personGroupId}/{personId}")]
    public Object CreatePerson(string personGroupId, string personId) => face.CreatePerson(personGroupId, personId);

    //Elimino a una persona dentro de un grupo
    [HttpDelete("people/{personGroupId}/{personId}")]
    public Object DeletePerson(string personGroupId, string personId) => face.DeletePerson(personGroupId, personId);

    //Obtengo el listado de personas de un grupo
    [HttpGet("people/{personGroupId}")]
    public Object GetPersons(string personGroupId) => face.GetPersons(personGroupId);

    //Agrego una cara/imagen a una persona indicando el grupo, la persona y enviando la url de la imágen
    [HttpPost("faces/{personGroupId}/{personId}")]
    public Object AddFace(string personGroupId, string personId, Face fa) => face.AddFace(personGroupId, personId, fa.url);

    //Elimino una cara/imagen a una persona indicando el grupo, la persona y enviando la url de la imágen
    [HttpDelete("faces/{personGroupId}/{personId}/{faceId}")]
    public Object DeleteFace(string personGroupId, string personId, string faceId) => face.DeleteFace(personGroupId, personId, faceId);

    //Obtengo una cara/imagen a una persona indicando el grupo, la persona y enviando la url de la imágen
    [HttpGet("faces/{personGroupId}/{personId}/{faceId}")]
    public Object GetFace(string personGroupId, string personId, string faceId) => face.GetFace(personGroupId, personId, faceId);

    //Entreno a un grupo
    [HttpPost("groups/train/{personGroupId}")]
    public Object TrainGroup(string personGroupId) => face.TrainPersonGroup(personGroupId);

    //Detecto una cara, es necesario para obtener el ID q voy a utilizar en otros métodos
    [HttpPost("detect")]
    public Object DetectFace(Face fa) => face.DetectFace(fa.url);

    //Obtengo el estado de entrenamiento de un grupo
    [HttpGet("groups/train/{personGroupId}")]
    public Object TrainGroupStatus(string personGroupId) => face.TrainGroupStatus(personGroupId);

  }
}
