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
    public class CdtCodesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CdtCodesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: CdtCodes
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.CdtCodes.Include(c => c.CdtCodeCategory).Include(c => c.CdtCodeSubcategory).Include(c => c.Facility);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: CdtCodes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cdtCode = await _context.CdtCodes
                .Include(c => c.CdtCodeCategory)
                .Include(c => c.CdtCodeSubcategory)
                .Include(c => c.Facility)
                .FirstOrDefaultAsync(m => m.CdtCodeId == id);
            if (cdtCode == null)
            {
                return NotFound();
            }

            return View(cdtCode);
        }

        // GET: CdtCodes/Create
        public IActionResult Create()
        {
            ViewData["CdtCodeCategoryId"] = new SelectList(_context.CdtCodeCategories, "CdtCodeCategoryId", "CdtCodeCategoryId");
            ViewData["CdtCodeSubcategoryId"] = new SelectList(_context.CdtCodeSubcategories, "CdtCodeSubcategoryId", "CdtCodeSubcategoryId");
            ViewData["FacilityId"] = new SelectList(_context.Facilities, "FacilityId", "FacilityId");
            return View();
        }

        // POST: CdtCodes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CdtCodeId,Code,FacilityId,CdtCodeCategoryId,CdtCodeSubcategoryId,LongDescription,ShortDescription,CreatedAt,ModifiedAt")] CdtCode cdtCode)
        {
            if (ModelState.IsValid)
            {
                _context.Add(cdtCode);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CdtCodeCategoryId"] = new SelectList(_context.CdtCodeCategories, "CdtCodeCategoryId", "CdtCodeCategoryId", cdtCode.CdtCodeCategoryId);
            ViewData["CdtCodeSubcategoryId"] = new SelectList(_context.CdtCodeSubcategories, "CdtCodeSubcategoryId", "CdtCodeSubcategoryId", cdtCode.CdtCodeSubcategoryId);
            ViewData["FacilityId"] = new SelectList(_context.Facilities, "FacilityId", "FacilityId", cdtCode.FacilityId);
            return View(cdtCode);
        }

        // GET: CdtCodes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cdtCode = await _context.CdtCodes.FindAsync(id);
            if (cdtCode == null)
            {
                return NotFound();
            }
            ViewData["CdtCodeCategoryId"] = new SelectList(_context.CdtCodeCategories, "CdtCodeCategoryId", "CdtCodeCategoryId", cdtCode.CdtCodeCategoryId);
            ViewData["CdtCodeSubcategoryId"] = new SelectList(_context.CdtCodeSubcategories, "CdtCodeSubcategoryId", "CdtCodeSubcategoryId", cdtCode.CdtCodeSubcategoryId);
            ViewData["FacilityId"] = new SelectList(_context.Facilities, "FacilityId", "FacilityId", cdtCode.FacilityId);
            return View(cdtCode);
        }

        // POST: CdtCodes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CdtCodeId,Code,FacilityId,CdtCodeCategoryId,CdtCodeSubcategoryId,LongDescription,ShortDescription,CreatedAt,ModifiedAt")] CdtCode cdtCode)
        {
            if (id != cdtCode.CdtCodeId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(cdtCode);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CdtCodeExists(cdtCode.CdtCodeId))
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
            ViewData["CdtCodeCategoryId"] = new SelectList(_context.CdtCodeCategories, "CdtCodeCategoryId", "CdtCodeCategoryId", cdtCode.CdtCodeCategoryId);
            ViewData["CdtCodeSubcategoryId"] = new SelectList(_context.CdtCodeSubcategories, "CdtCodeSubcategoryId", "CdtCodeSubcategoryId", cdtCode.CdtCodeSubcategoryId);
            ViewData["FacilityId"] = new SelectList(_context.Facilities, "FacilityId", "FacilityId", cdtCode.FacilityId);
            return View(cdtCode);
        }

        // GET: CdtCodes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cdtCode = await _context.CdtCodes
                .Include(c => c.CdtCodeCategory)
                .Include(c => c.CdtCodeSubcategory)
                .Include(c => c.Facility)
                .FirstOrDefaultAsync(m => m.CdtCodeId == id);
            if (cdtCode == null)
            {
                return NotFound();
            }

            return View(cdtCode);
        }

        // POST: CdtCodes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var cdtCode = await _context.CdtCodes.FindAsync(id);
            if (cdtCode != null)
            {
                _context.CdtCodes.Remove(cdtCode);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CdtCodeExists(int id)
        {
            return _context.CdtCodes.Any(e => e.CdtCodeId == id);
        }
    }
}
