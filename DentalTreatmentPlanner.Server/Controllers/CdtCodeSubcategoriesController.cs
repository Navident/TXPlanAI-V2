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
    public class CdtCodeSubcategoriesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CdtCodeSubcategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: CdtCodeSubcategories
        public async Task<IActionResult> Index()
        {
            return View(await _context.CdtCodeSubcategories.ToListAsync());
        }

        // GET: CdtCodeSubcategories/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cdtCodeSubcategory = await _context.CdtCodeSubcategories
                .FirstOrDefaultAsync(m => m.CdtCodeSubcategoryId == id);
            if (cdtCodeSubcategory == null)
            {
                return NotFound();
            }

            return View(cdtCodeSubcategory);
        }

        // GET: CdtCodeSubcategories/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CdtCodeSubcategories/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CdtCodeSubcategoryId,Name,CreatedAt,ModifiedAt")] CdtCodeSubcategory cdtCodeSubcategory)
        {
            if (ModelState.IsValid)
            {
                _context.Add(cdtCodeSubcategory);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(cdtCodeSubcategory);
        }

        // GET: CdtCodeSubcategories/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cdtCodeSubcategory = await _context.CdtCodeSubcategories.FindAsync(id);
            if (cdtCodeSubcategory == null)
            {
                return NotFound();
            }
            return View(cdtCodeSubcategory);
        }

        // POST: CdtCodeSubcategories/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CdtCodeSubcategoryId,Name,CreatedAt,ModifiedAt")] CdtCodeSubcategory cdtCodeSubcategory)
        {
            if (id != cdtCodeSubcategory.CdtCodeSubcategoryId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(cdtCodeSubcategory);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CdtCodeSubcategoryExists(cdtCodeSubcategory.CdtCodeSubcategoryId))
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
            return View(cdtCodeSubcategory);
        }

        // GET: CdtCodeSubcategories/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cdtCodeSubcategory = await _context.CdtCodeSubcategories
                .FirstOrDefaultAsync(m => m.CdtCodeSubcategoryId == id);
            if (cdtCodeSubcategory == null)
            {
                return NotFound();
            }

            return View(cdtCodeSubcategory);
        }

        // POST: CdtCodeSubcategories/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var cdtCodeSubcategory = await _context.CdtCodeSubcategories.FindAsync(id);
            if (cdtCodeSubcategory != null)
            {
                _context.CdtCodeSubcategories.Remove(cdtCodeSubcategory);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CdtCodeSubcategoryExists(int id)
        {
            return _context.CdtCodeSubcategories.Any(e => e.CdtCodeSubcategoryId == id);
        }
    }
}
