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
    public class FacilityProviderMapsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public FacilityProviderMapsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: FacilityProviderMaps
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.FacilityProviderMaps.Include(f => f.Facility).Include(f => f.Provider);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: FacilityProviderMaps/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var facilityProviderMap = await _context.FacilityProviderMaps
                .Include(f => f.Facility)
                .Include(f => f.Provider)
                .FirstOrDefaultAsync(m => m.FacilityProviderMapId == id);
            if (facilityProviderMap == null)
            {
                return NotFound();
            }

            return View(facilityProviderMap);
        }

        // GET: FacilityProviderMaps/Create
        public IActionResult Create()
        {
            ViewData["FacilityId"] = new SelectList(_context.Facilities, "FacilityId", "FacilityId");
            ViewData["ProviderId"] = new SelectList(_context.Providers, "ProviderId", "ProviderId");
            return View();
        }

        // POST: FacilityProviderMaps/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("FacilityProviderMapId,FacilityId,ProviderId,CreatedAt,ModifiedAt")] FacilityProviderMap facilityProviderMap)
        {
            if (ModelState.IsValid)
            {
                _context.Add(facilityProviderMap);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["FacilityId"] = new SelectList(_context.Facilities, "FacilityId", "FacilityId", facilityProviderMap.FacilityId);
            ViewData["ProviderId"] = new SelectList(_context.Providers, "ProviderId", "ProviderId", facilityProviderMap.ProviderId);
            return View(facilityProviderMap);
        }

        // GET: FacilityProviderMaps/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var facilityProviderMap = await _context.FacilityProviderMaps.FindAsync(id);
            if (facilityProviderMap == null)
            {
                return NotFound();
            }
            ViewData["FacilityId"] = new SelectList(_context.Facilities, "FacilityId", "FacilityId", facilityProviderMap.FacilityId);
            ViewData["ProviderId"] = new SelectList(_context.Providers, "ProviderId", "ProviderId", facilityProviderMap.ProviderId);
            return View(facilityProviderMap);
        }

        // POST: FacilityProviderMaps/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("FacilityProviderMapId,FacilityId,ProviderId,CreatedAt,ModifiedAt")] FacilityProviderMap facilityProviderMap)
        {
            if (id != facilityProviderMap.FacilityProviderMapId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(facilityProviderMap);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!FacilityProviderMapExists(facilityProviderMap.FacilityProviderMapId))
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
            ViewData["FacilityId"] = new SelectList(_context.Facilities, "FacilityId", "FacilityId", facilityProviderMap.FacilityId);
            ViewData["ProviderId"] = new SelectList(_context.Providers, "ProviderId", "ProviderId", facilityProviderMap.ProviderId);
            return View(facilityProviderMap);
        }

        // GET: FacilityProviderMaps/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var facilityProviderMap = await _context.FacilityProviderMaps
                .Include(f => f.Facility)
                .Include(f => f.Provider)
                .FirstOrDefaultAsync(m => m.FacilityProviderMapId == id);
            if (facilityProviderMap == null)
            {
                return NotFound();
            }

            return View(facilityProviderMap);
        }

        // POST: FacilityProviderMaps/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var facilityProviderMap = await _context.FacilityProviderMaps.FindAsync(id);
            if (facilityProviderMap != null)
            {
                _context.FacilityProviderMaps.Remove(facilityProviderMap);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool FacilityProviderMapExists(int id)
        {
            return _context.FacilityProviderMaps.Any(e => e.FacilityProviderMapId == id);
        }
    }
}
