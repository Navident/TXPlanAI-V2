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
    public class ProcedureTypesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProcedureTypesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: ProcedureTypes
        public async Task<IActionResult> Index()
        {
            return View(await _context.ProcedureTypes.ToListAsync());
        }

        // GET: ProcedureTypes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var procedureType = await _context.ProcedureTypes
                .FirstOrDefaultAsync(m => m.ProcedureTypeId == id);
            if (procedureType == null)
            {
                return NotFound();
            }

            return View(procedureType);
        }

        // GET: ProcedureTypes/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: ProcedureTypes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ProcedureTypeId,Name,Description,CreatedAt,ModifiedAt")] ProcedureType procedureType)
        {
            if (ModelState.IsValid)
            {
                _context.Add(procedureType);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(procedureType);
        }

        // GET: ProcedureTypes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var procedureType = await _context.ProcedureTypes.FindAsync(id);
            if (procedureType == null)
            {
                return NotFound();
            }
            return View(procedureType);
        }

        // POST: ProcedureTypes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ProcedureTypeId,Name,Description,CreatedAt,ModifiedAt")] ProcedureType procedureType)
        {
            if (id != procedureType.ProcedureTypeId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(procedureType);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProcedureTypeExists(procedureType.ProcedureTypeId))
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
            return View(procedureType);
        }

        // GET: ProcedureTypes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var procedureType = await _context.ProcedureTypes
                .FirstOrDefaultAsync(m => m.ProcedureTypeId == id);
            if (procedureType == null)
            {
                return NotFound();
            }

            return View(procedureType);
        }

        // POST: ProcedureTypes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var procedureType = await _context.ProcedureTypes.FindAsync(id);
            if (procedureType != null)
            {
                _context.ProcedureTypes.Remove(procedureType);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ProcedureTypeExists(int id)
        {
            return _context.ProcedureTypes.Any(e => e.ProcedureTypeId == id);
        }
    }
}
