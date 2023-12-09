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
    public class CdtCodeCategoriesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CdtCodeCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: CdtCodeCategories
        public async Task<IActionResult> Index()
        {
            return View(await _context.CdtCodeCategories.ToListAsync());
        }

        // GET: CdtCodeCategories/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cdtCodeCategory = await _context.CdtCodeCategories
                .FirstOrDefaultAsync(m => m.CdtCodeCategoryId == id);
            if (cdtCodeCategory == null)
            {
                return NotFound();
            }

            return View(cdtCodeCategory);
        }

        // GET: CdtCodeCategories/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CdtCodeCategories/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CdtCodeCategoryId,Name,CreatedAt,ModifiedAt")] CdtCodeCategory cdtCodeCategory)
        {
            if (ModelState.IsValid)
            {
                _context.Add(cdtCodeCategory);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(cdtCodeCategory);
        }

        // GET: CdtCodeCategories/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cdtCodeCategory = await _context.CdtCodeCategories.FindAsync(id);
            if (cdtCodeCategory == null)
            {
                return NotFound();
            }
            return View(cdtCodeCategory);
        }

        // POST: CdtCodeCategories/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CdtCodeCategoryId,Name,CreatedAt,ModifiedAt")] CdtCodeCategory cdtCodeCategory)
        {
            if (id != cdtCodeCategory.CdtCodeCategoryId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(cdtCodeCategory);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CdtCodeCategoryExists(cdtCodeCategory.CdtCodeCategoryId))
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
            return View(cdtCodeCategory);
        }

        // GET: CdtCodeCategories/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cdtCodeCategory = await _context.CdtCodeCategories
                .FirstOrDefaultAsync(m => m.CdtCodeCategoryId == id);
            if (cdtCodeCategory == null)
            {
                return NotFound();
            }

            return View(cdtCodeCategory);
        }

        // POST: CdtCodeCategories/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var cdtCodeCategory = await _context.CdtCodeCategories.FindAsync(id);
            if (cdtCodeCategory != null)
            {
                _context.CdtCodeCategories.Remove(cdtCodeCategory);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CdtCodeCategoryExists(int id)
        {
            return _context.CdtCodeCategories.Any(e => e.CdtCodeCategoryId == id);
        }
    }
}
