using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using BitsOrchestraTest.Db;
using BitsOrchestraTest.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;

namespace BitsOrchestraTest.Services
{
    public class Service
    {
        private readonly PersonDbContext _context;

        public Service(PersonDbContext context)
        {
            _context = context;
        }

        public void SaveDataFromFile(string path, IFormFile file)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            string fileName = Path.GetFileName(file.FileName);
            using (FileStream stream = new FileStream(path + fileName, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            using (StreamReader reader = new StreamReader(path + fileName))
            {
                using (CsvReader csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)))
                {
                    try
                    {
                        var records = csv.GetRecords<PersonModel>().ToList();
                        _context.People.AddRange(records);
                        _context.SaveChanges();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                    }
                }
            }
        }

        public IEnumerable<PersonModel> GetPeople()
        {
            return _context.People.ToList();
        }

        public void DeletePerson(int id)
        {
            var person = _context.People.FirstOrDefault(p => p.Id == id);
            if (person != null)
            {
                _context.People.Remove(person);
                _context.SaveChanges();
            }
        }
    }
}