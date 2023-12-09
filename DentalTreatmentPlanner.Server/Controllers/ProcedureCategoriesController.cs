using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DentalTreatmentPlanner.Server.Data;
using DentalTreatmentPlanner.Server.Models;

namespace DentalTreatmentPlanner.Server.Controllers
{
    public class ProcedureCategoriesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProcedureCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: ProcedureCategories
        public async Task<IActionResult> Index()
        {
            return View(await _context.ProcedureCategories.ToListAsync());
        }

        // GET: ProcedureCategories/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var procedureCategory = await _context.ProcedureCategories
                .FirstOrDefaultAsync(m => m.ProcedureCategoryId == id);
            if (procedureCategory == null)
            {
                return NotFound();
            }

            return View(procedureCategory);
        }

        // GET: ProcedureCategories/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: ProcedureCategories/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ProcedureCategoryId,Name,Description,CreatedAt,ModifiedAt")] ProcedureCategory procedureCategory)
        {
            if (ModelState.IsValid)
            {
                _context.Add(procedureCategory);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(procedureCategory);
        }

        // GET: ProcedureCategories/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var procedureCategory = await _context.ProcedureCategories.FindAsync(id);
            if (procedureCategory == null)
            {
                return NotFound();
            }
            return View(procedureCategory);
        }

        // POST: ProcedureCategories/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ProcedureCategoryId,Name,Description,CreatedAt,ModifiedAt")] ProcedureCategory procedureCategory)
        {
            if (id != procedureCategory.ProcedureCategoryId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(procedureCategory);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProcedureCategoryExists(procedureCategory.ProcedureCategoryId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(procedureCategory);
        }

        // GET: ProcedureCategories/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var procedureCategory = await _context.ProcedureCategories
                .FirstOrDefaultAsync(m => m.ProcedureCategoryId == id);
            if (procedureCategory == null)
            {
                return NotFound();
            }

            return View(procedureCategory);
        }

        // POST: ProcedureCategories/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var procedureCategory = await _context.ProcedureCategories.FindAsync(id);
            if (procedureCategory != null)
            {
                _context.ProcedureCategories.Remove(procedureCategory);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ProcedureCategoryExists(int id)
        {
            return _context.ProcedureCategories.Any(e => e.ProcedureCategoryId == id);
        }
    }
}
