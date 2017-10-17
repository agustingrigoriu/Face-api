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

namespace FaceApi.Controllers
{
  [Route("api/[controller]")]
  public class RecognitionController : Controller
  {
    private readonly FaceAPI face;
    public RecognitionController(FaceAPI face) => this.face = face;

    [HttpPut("groups/{personGroupId}")]
    public Object CreateGroup(string personGroupId, string name) => face.CreateFaceGroup(personGroupId, name);

    [HttpDelete("groups/{personGroupId}")]
    public Object DeleteGroup(string personGroupId) => face.DeleteFaceGroup(personGroupId);

    [HttpGet("groups")]
    public Object GetGroups() => face.GetFaceGroups();

    [HttpPost("persons/{personGroupId}/{personId}")]
    public Object CreatePerson(string personGroupId, string personId) => face.CreatePerson(personGroupId, personId);

    [HttpDelete("persons/{personGroupId}/{personId}")]
    public Object DeletePerson(string personGroupId, string personId) => face.DeletePerson(personGroupId, personId);
    [HttpGet("persons/{personGroupId}")]
    public Object GetPersons(string personGroupId) => face.GetPersons(personGroupId);

  }
}
