import type { SimulationScenario } from '../repository/types';

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sparse_module',
    name: 'Sparse module graph',
    description: 'A single small module: few nodes, few call/import edges, fast to lay out.',
    seed: 1540,
    iterations: 28,
    initialCost: 148,
    convergenceRate: 0.09,
  },
  {
    id: 'dense_hub',
    name: 'Dense hub module',
    description: 'A heavily-imported utility module with many crossing call edges under stress majorization.',
    seed: 1555,
    iterations: 28,
    initialCost: 164,
    convergenceRate: 0.075,
  },
  {
    id: 'deep_hierarchy',
    name: 'Deep inheritance hierarchy',
    description: 'A tall class hierarchy testing the MIP refinement pass on long chains of edges.',
    seed: 1560,
    iterations: 28,
    initialCost: 139,
    convergenceRate: 0.115,
  },
];

export function getSimulationScenario(id: string): SimulationScenario {
  return SIMULATION_SCENARIOS.find((s) => s.id === id) ?? SIMULATION_SCENARIOS[0];
}
