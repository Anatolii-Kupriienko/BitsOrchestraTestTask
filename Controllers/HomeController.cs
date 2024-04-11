using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using BitsOrchestraTest.Models;
using BitsOrchestraTest.Services;

namespace BitsOrchestraTest.Controllers;

public class HomeController : Controller
{
    private readonly IWebHostEnvironment Environment;
    private readonly Service Service;

    public HomeController(IWebHostEnvironment environment, Service fileService)
    {
        Environment = environment;
        Service = fileService;
    }

    [HttpGet]
    public IActionResult Index()
    {
        var data = Service.GetPeople();
        return View(data);
    }

    [HttpPost]
    public IActionResult Index(IFormFile file)
    {
        string path = this.Environment.WebRootPath + "\\uploads\\";
        Service.SaveDataFromFile(path, file);
        return RedirectToAction("Index");
    }

    public IActionResult Delete(int id)
    {
        Service.DeletePerson(id);
        return RedirectToAction("Index");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
