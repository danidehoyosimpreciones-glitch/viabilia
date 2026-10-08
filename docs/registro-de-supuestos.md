# Registro de supuestos

## Supuestos generales de la herramienta
| Supuesto | Tratamiento en Viabilia |
|---|---|
| TMAR | La define el usuario en la ficha (% anual). Es la tasa de descuento. |
| Inflación | La define el usuario (% anual). Los flujos netos crecen con ella. |
| Periodo de análisis | La vida útil de cada alternativa, en años. |
| Método de comparación | CAUE, que permite comparar alternativas con distinta vida útil. |
| Flujos | Ingresos y costos anuales constantes en el año 1 y ajustados por inflación en los siguientes. |
| Valor de salvamento | Se recibe al final de la vida útil. |
| Repetición | Cada alternativa se puede renovar en las mismas condiciones (supuesto clásico del CAUE). |
| Impuestos, depreciación y crédito | No se consideran en esta versión. |
| Moneda | Pesos colombianos ($), sin conversión. |

## Caso real: congelador de la tienda de Ceris Paola de Hoyos
**Beneficiario:** tienda de barrio de la señora Ceris Paola de Hoyos, barrio Alto de las Acacias.

**Decisión que se evalúa:** qué hacer con un congelador horizontal con más de 4 años de uso, con la tapa rota, el aislamiento expuesto y oxidación avanzada. La tienda cuenta con otros dos congeladores, por lo que no pierde ventas si este falla; la decisión depende de los costos de cada opción.

**Alternativas:** reparar, comprar uno usado y comprar uno nuevo (modelo Indufrial ICC-210 ECO de 212 litros). La opción de seguir con el equipo actual se descarta del cálculo: su vida útil restante se estima en menos de 3 meses por riesgo de daño inminente, y la herramienta exige una vida útil mínima de 1 año.

### Tasas
| Parámetro | Valor | Fuente | Estado |
|---|---|---|---|
| Referencia para la TMAR | 12,07 % E.A. (CDT a 360 días, promedio) | Banco de la República, semana del 28 de septiembre al 4 de octubre de 2026, publicada por Rankia | Dato de mercado, consultado el 7 de octubre de 2026 |
| Inflación | 6,24 % anual (agosto de 2026) | DANE, publicada por Noticias RCN el 7 de septiembre de 2026 | Dato oficial, consultado el 7 de octubre de 2026 |
| TMAR real usada en el modelo | 5,49 % | (1,1207 ÷ 1,0624) − 1, ecuación de Fisher | Calculada |
| Inflación usada en el modelo | 0 % | El análisis se hace en pesos constantes | Decisión de modelado |

El análisis se hace en pesos constantes porque la ganancia es igual en las tres alternativas. Con tasas nominales e inflación, la alternativa de mayor duración recibiría más ganancia solo por el efecto de la inflación, y eso distorsionaría la comparación.

### Ingresos
| Parámetro | Valor | Fuente | Estado |
|---|---|---|---|
| Ventas diarias del congelador | $150.000 | Estimación de la propietaria | Estimado, sin registro de ventas |
| Días de operación al año | 365 | La tienda abre todos los días | Reportado por la propietaria |
| Margen de ganancia | 20 % | Supuesto del grupo | Estimado, por confirmar con la propietaria |
| Ganancia anual atribuida | $10.950.000 | $150.000 × 365 × 20 % | Calculado; igual en las tres alternativas |

### Alternativas
| Parámetro | Reparar | Usado | Nuevo | Fuente | Estado |
|---|---|---|---|---|---|
| Inversión inicial | $650.000 | $750.000 | $1.250.000 | Nuevo: ficha del fabricante Indufrial (precio de oferta, antes $1.670.000), consultada el 7 de octubre de 2026. Usado y reparación: rango de mercado de portales de clasificados y estimación de costo de reparación | Nuevo verificado; usado y reparar estimados |
| Vida útil (años) | 3 | 4 | 10 | Estimaciones de referencia; el fabricante da 3 años de garantía en el compresor | Estimado, sin confirmación de un técnico |
| Valor de salvamento | $0 | $0 | $0 | Supuesto conservador | Supuesto |
| Consumo de energía (kWh al mes) | 60 | 50 | 34,5 | Nuevo: ficha técnica del fabricante (34,5 kWh al mes a 24 h al día). Reparado y usado: supuesto del grupo | Nuevo verificado; los demás son supuestos |
| Precio del kWh | $950 | $950 | $950 | Valor de referencia | Supuesto, sin comprobante de la tienda |
| Mantenimiento anual | $150.000 | $100.000 | $50.000 | Supuesto del grupo | Supuesto |
| Costos anuales (energía + mantenimiento) | $834.000 | $670.000 | $443.300 | Calculado | Calculado |

### Datos de contexto (no entran al modelo)
- Factura de energía de toda la tienda: cerca de $225.000 el mes anterior y cerca de $237.000 el mes actual, según la propietaria. No se cuenta con los comprobantes.
- Consumo estimado del congelador deteriorado: cerca de 105 kWh al mes, calculado a partir de una fotografía y sin medición.
- Contexto del barrio: más de 500 habitantes, con tiendas más grandes alrededor.

## Resultados con estos supuestos
Para contrastar con el dashboard (TMAR 5,49 % e inflación 0 %):

| Alternativa | CAUE (por año) |
|---|---|
| Nuevo | $10.340.964 |
| Usado | $10.066.090 |
| Reparar | $9.875.131 |

La alternativa de mayor CAUE es comprar el congelador nuevo. La conclusión se mantiene al variar la TMAR en 3 puntos y al suponer que el equipo reparado consume lo mismo que el nuevo.

## Límites y datos por verificar
- Los datos marcados como estimados o supuestos deben confirmarse antes de tomar la decisión real: comprobante de energía, cotizaciones del usado y de la reparación, y la vida útil con un técnico.
- La TIR, el VPN y el B/C resultan muy altos porque la inversión es pequeña frente a la ganancia, y esa ganancia no depende solo de esta decisión. Por eso la comparación se interpreta por el CAUE.
- Si los datos reales cambian, basta con actualizarlos en la plataforma: el dashboard se recalcula solo.
