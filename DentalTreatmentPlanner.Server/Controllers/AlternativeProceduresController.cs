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
    public class AlternativeProceduresController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AlternativeProceduresController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: AlternativeProcedures
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.AlternativeProcedures.Include(a => a.CdtCode);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: AlternativeProcedures/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var alternativeProcedure = await _context.AlternativeProcedures
                .Include(a => a.CdtCode)
                .FirstOrDefaultAsync(m => m.AlternativeProcedureId == id);
            if (alternativeProcedure == null)
            {
                return NotFound();
            }

            return View(alternativeProcedure);
        }

        // GET: AlternativeProcedures/Create
        public IActionResult Create()
        {
            ViewData["CdtCodeId"] = new SelectList(_context.CdtCodes, "CdtCodeId", "CdtCodeId");
            return View();
        }

        // POST: AlternativeProcedures/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("AlternativeProcedureId,CdtCodeId,Type,Description,CreatedAt,ModifiedAt")] AlternativeProcedure alternativeProcedure)
        {
            if (ModelState.IsValid)
            {
                _context.Add(alternativeProcedure);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CdtCodeId"] = new SelectList(_context.CdtCodes, "CdtCodeId", "CdtCodeId", alternativeProcedure.CdtCodeId);
            return View(alternativeProcedure);
        }

        // GET: AlternativeProcedures/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var alternativeProcedure = await _context.AlternativeProcedures.FindAsync(id);
            if (alternativeProcedure == null)
            {
                return NotFound();
            }
            ViewData["CdtCodeId"] = new SelectList(_context.CdtCodes, "CdtCodeId", "CdtCodeId", alternativeProcedure.CdtCodeId);
            return View(alternativeProcedure);
        }

        // POST: AlternativeProcedures/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("AlternativeProcedureId,CdtCodeId,Type,Description,CreatedAt,ModifiedAt")] AlternativeProcedure alternativeProcedure)
        {
            if (id != alternativeProcedure.AlternativeProcedureId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(alternativeProcedure);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AlternativeProcedureExists(alternativeProcedure.AlternativeProcedureId))
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
            ViewData["CdtCodeId"] = new SelectList(_context.CdtCodes, "CdtCodeId", "CdtCodeId", alternativeProcedure.CdtCodeId);
            return View(alternativeProcedure);
        }

        // GET: AlternativeProcedures/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var alternativeProcedure = await _context.AlternativeProcedures
                .Include(a => a.CdtCode)
                .FirstOrDefaultAsync(m => m.AlternativeProcedureId == id);
            if (alternativeProcedure == null)
            {
                return NotFound();
            }

            return View(alternativeProcedure);
        }

        // POST: AlternativeProcedures/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var alternativeProcedure = await _context.AlternativeProcedures.FindAsync(id);
            if (alternativeProcedure != null)
            {
                _context.AlternativeProcedures.Remove(alternativeProcedure);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AlternativeProcedureExists(int id)
        {
            return _context.AlternativeProcedures.Any(e => e.AlternativeProcedureId == id);
        }
    }
}
