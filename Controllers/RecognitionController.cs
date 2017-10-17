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

namespace FaceApi.Controllers
{
  [Route("api/[controller]")]
  public class RecognitionController : Controller
  {
    private readonly FaceAPI face;
    public RecognitionController(FaceAPI face) => this.face = face;

    //Creo un grupo de personas, se indica en la url el identificador de ese grupo. Ej: visitas, se envía también un name o nombre por JSON
    [HttpPut("groups/{personGroupId}")]
    public Object CreateGroup(string personGroupId, [FromBody] Group group) => face.CreateFaceGroup(personGroupId, group.name);

    //Elimino el grupo a través de su identificador
    [HttpDelete("groups/{personGroupId}")]
    public Object DeleteGroup(string personGroupId) => face.DeleteFaceGroup(personGroupId);

    //Obtengo todos los grupos
    [HttpGet("groups")]
    public Object GetGroups() => face.GetFaceGroups();

    //Creo una persona indicando el grupo al que pertenecerá y un identificador/Nombre. Devuelve su identificador único
    [HttpPost("persons/{personGroupId}/{personId}")]
    public Object CreatePerson(string personGroupId, string personId) => face.CreatePerson(personGroupId, personId);

    //Elimino a una persona dentro de un grupo
    [HttpDelete("persons/{personGroupId}/{personId}")]
    public Object DeletePerson(string personGroupId, string personId) => face.DeletePerson(personGroupId, personId);

    //Obtengo el listado de personas de un grupo
    [HttpGet("persons/{personGroupId}")]
    public Object GetPersons(string personGroupId) => face.GetPersons(personGroupId);

    //Agrego una cara/imagen a una persona indicando el grupo, la persona y enviando la url de la imágen
    [HttpGet("face/{personGroupId}/{personId}")]
    public Object AddFace(string personGroupId, string personId, [FromBody] Face fa) => face.AddFace(personGroupId, personId, fa.url);

  }
}
