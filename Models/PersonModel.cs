using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper.Configuration.Attributes;

namespace BitsOrchestraTest.Models
{
    public class PersonModel
    {
        [Ignore]
        public int Id { get; set; }
        public string Name { get; set; }
        [Name("Date of Birth")]
        public DateTime BirthDate { get; set; }
        [Name("Married")]
        public bool IsMarried { get; set; }
        [Name("Phone")]
        public string PhoneNumber { get; set; }
        public decimal Salary { get; set; }

        public PersonModel(string name, DateTime birthDate, bool isMarried, string phoneNumber, decimal salary)
        {
            Name = name;
            BirthDate = birthDate;
            IsMarried = isMarried;
            PhoneNumber = phoneNumber;
            Salary = salary;
        }

        public PersonModel() { }

        public override string ToString()
        {
            return $"Name: {Name}, BirthDate: {BirthDate}, IsMarried: {IsMarried}, PhoneNumber: {PhoneNumber}, Salary: {Salary}";
        }
    }
}