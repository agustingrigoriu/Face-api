using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace FaceApi.Services
{
  public class FaceAPI
  {
    // **********************************************
    // *** Update or verify the following values. ***
    // **********************************************

    // Replace the subscriptionKey string value with your valid subscription key.
    const string subscriptionKey = "3e1606fa44d54913ac984e2351938e10";

    // Replace or verify the region.
    //
    // You must use the same region in your REST API call as you used to obtain your subscription keys.
    // For example, if you obtained your subscription keys from the westus region, replace 
    // "westcentralus" in the URI below with "westus".
    //
    // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
    // a free trial subscription key, you should not need to change this region.
    const string uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0";


    // static void Main()
    // {
    //   // Get the path and filename to process from the user.
    //   Console.WriteLine("Detect faces:");
    //   Console.Write("Enter the path to an image with faces that you wish to analzye: ");
    //   string imageFilePath = Console.ReadLine();

    //   // Execute the REST API call.
    //   MakeAnalysisRequest(imageFilePath);

    //   Console.WriteLine("\nPlease wait a moment for the results to appear. Then, press Enter to exit...\n");
    //   Console.ReadLine();
    // }

    public async Task<Object> CreateFaceGroup(string personGroupId, string name)
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      var uri = uriBase + "/persongroups/" + personGroupId;

      HttpResponseMessage response;

      // Request body
      string json = "{\"name\": \"" + name + "\" }";
      byte[] byteData = Encoding.UTF8.GetBytes(json);

      using (var content = new ByteArrayContent(byteData))
      {
        content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        response = await client.PutAsync(uri, content);
        // Get the JSON response.
        return await response.Content.ReadAsStringAsync();
      }
    }

    public async Task<Object> DeleteFaceGroup(string personGroupId)
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      var uri = uriBase + "/persongroups/" + personGroupId;

      HttpResponseMessage response = await client.DeleteAsync(uri);

      // Get the JSON response.
      return await response.Content.ReadAsStringAsync();
    }

    public async Task<Object> GetFaceGroups()
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);
      HttpResponseMessage response;

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      // Request parameters
      queryString["start"] = "{string}";
      queryString["top"] = "1000";
      var uri = uriBase + "/persongroups";

      response = await client.GetAsync(uri);
      // Get the JSON response.
      return await response.Content.ReadAsStringAsync();
    }

    public async Task<Object> CreatePerson(string personGroupId, string person_name)
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      var uri = uriBase + "/persongroups/" + personGroupId + "/persons";

      HttpResponseMessage response;

      // Request body
      string json = "{\"name\": \"" + person_name + "\" }";
      byte[] byteData = Encoding.UTF8.GetBytes(json);

      using (var content = new ByteArrayContent(byteData))
      {
        content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        response = await client.PostAsync(uri, content);
        return await response.Content.ReadAsStringAsync();
      }
    }

    public async Task<Object> DeletePerson(string personGroupId, string personId)
    {

      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      var uri = uriBase + "/persongroups/" + personGroupId + "/persons/" + personId;
      var response = await client.DeleteAsync(uri);
      return await response.Content.ReadAsStringAsync();
    }

    public async Task<Object> GetPersons(string personGroupId)
    {

      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      // Request parameters
      queryString["start"] = "{string}";
      queryString["top"] = "1000";
      var uri = uriBase + "/persongroups/" + personGroupId + "/persons";

      var response = await client.GetAsync(uri);
      return await response.Content.ReadAsStringAsync();

    }

    public async Task<Object> AddFace(string personGroupId, string personId, string url)
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      var uri = uriBase + "/persongroups/" + personGroupId + "/persons/" + personId + "/persistedFaces";

      HttpResponseMessage response;

      // Request body
      // Request body. Posts a locally stored JPEG image.
      byte[] byteData = GetImageAsByteArray(url);

      using (ByteArrayContent content = new ByteArrayContent(byteData))
      {
        // This example uses content type "application/octet-stream".
        // The other content types you can use are "application/json" and "multipart/form-data".
        content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        // Execute the REST API call.
        response = await client.PostAsync(uri, content);

        // Get the JSON response.
        return await response.Content.ReadAsStringAsync();

        // Display the JSON response.
        // Console.WriteLine("\nResponse:\n");
        // Console.WriteLine(JsonPrettyPrint(contentString));
      }
    }

    public async Task<Object> DeleteFace(string personGroupId, string personId, string faceId)
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      var uri = uriBase + "/persongroups/" + personGroupId + "/persons/" + personId + "/persistedFaces/" + faceId;

      var response = await client.DeleteAsync(uri);
      return await response.Content.ReadAsStringAsync();

    }
    public async Task<Object> GetFace(string personGroupId, string personId, string faceId)
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      var uri = uriBase + "/persongroups/" + personGroupId + "/persons/" + personId + "/persistedFaces/" + faceId;

      var response = await client.GetAsync(uri);
      return await response.Content.ReadAsStringAsync();

    }
    public async Task<Object> TrainPersonGroup(string personGroupId)
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      var uri = uriBase + "/persongroups/" + personGroupId + "/train";

      HttpResponseMessage response;

      // Request body
      byte[] byteData = Encoding.UTF8.GetBytes("{}");

      using (var content = new ByteArrayContent(byteData))
      {
        content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        response = await client.PostAsync(uri, content);
        return await response.Content.ReadAsStringAsync();
      }
    }

    public async Task<Object> TrainGroupStatus(string personGroupId)
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      var uri = uriBase + "/persongroups/" + personGroupId + "/training";

      var response = await client.GetAsync(uri);
      return await response.Content.ReadAsStringAsync();

    }

    public async Task<Object> IdentifyFace(string personGroupId)
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      var uri = uriBase + "/identify";

      HttpResponseMessage response;

      // Request body
      byte[] byteData = Encoding.UTF8.GetBytes("{body}");

      using (var content = new ByteArrayContent(byteData))
      {
        content.Headers.ContentType = new MediaTypeHeaderValue("< your content type, i.e. application/json >");
        response = await client.PostAsync(uri, content);
        return await response.Content.ReadAsStringAsync();
      }
    }

    public async Task<Object> DetectFace(string url)
    {
      var client = new HttpClient();
      var queryString = HttpUtility.ParseQueryString(string.Empty);

      // Request headers
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);

      // Request parameters
      queryString["returnFaceId"] = "true";
      queryString["returnFaceLandmarks"] = "true";
      queryString["returnFaceAttributes"] = "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise";
      var uri =  uriBase + "/detect?" + queryString;

      HttpResponseMessage response;

      // Request body
      // Request body. Posts a locally stored JPEG image.
      byte[] byteData = GetImageAsByteArray(url);

      using (ByteArrayContent content = new ByteArrayContent(byteData))
      {
        // This example uses content type "application/octet-stream".
        // The other content types you can use are "application/json" and "multipart/form-data".
        content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        // Execute the REST API call.
        response = await client.PostAsync(uri, content);

        // Get the JSON response.
        return await response.Content.ReadAsStringAsync();

        // Display the JSON response.
        // Console.WriteLine("\nResponse:\n");
        // Console.WriteLine(JsonPrettyPrint(contentString));
      }
    }


    string JsonPrettyPrint(string json)
    {
      if (string.IsNullOrEmpty(json))
        return string.Empty;

      json = json.Replace(Environment.NewLine, "").Replace("\t", "");

      StringBuilder sb = new StringBuilder();
      bool quote = false;
      bool ignore = false;
      int offset = 0;
      int indentLength = 3;

      foreach (char ch in json)
      {
        switch (ch)
        {
          case '"':
            if (!ignore) quote = !quote;
            break;
          case '\'':
            if (quote) ignore = !ignore;
            break;
        }

        if (quote)
          sb.Append(ch);
        else
        {
          switch (ch)
          {
            case '{':
            case '[':
              sb.Append(ch);
              sb.Append(Environment.NewLine);
              sb.Append(new string(' ', ++offset * indentLength));
              break;
            case '}':
            case ']':
              sb.Append(Environment.NewLine);
              sb.Append(new string(' ', --offset * indentLength));
              sb.Append(ch);
              break;
            case ',':
              sb.Append(ch);
              sb.Append(Environment.NewLine);
              sb.Append(new string(' ', offset * indentLength));
              break;
            case ':':
              sb.Append(ch);
              sb.Append(' ');
              break;
            default:
              if (ch != ' ') sb.Append(ch);
              break;
          }
        }
      }

      return sb.ToString().Trim();
    }

    byte[] GetImageAsByteArray(string imageFilePath)
    {
      FileStream fileStream = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read);
      BinaryReader binaryReader = new BinaryReader(fileStream);
      return binaryReader.ReadBytes((int)fileStream.Length);
    }
  }
}