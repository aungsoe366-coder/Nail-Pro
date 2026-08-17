const fs = require('fs');
let content = fs.readFileSync('src/pages/BusinessAnalysisPage.tsx', 'utf8');

const target1 = `        {/* CHART 3: TOP-SELLING SERVICES (HORIZONTAL BAR CHART) */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Award size={18} className="text-primary" /> Top Performing Services
              </h3>
              <p className="text-xs text-muted-foreground">Most requested nail treatments & revenue volume</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-lg">
              Horizontal Bar
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            {topServicesData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                <p className="text-xs font-bold">No services sold yet in this period.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={topServicesData} 
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-muted-foreground/40" />
                  <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => \`\${v >= 1000000 ? (v/1000000).toFixed(1) + 'M' : (v/1000).toFixed(0) + 'k'}\`} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 11, fontWeight: 700 }} 
                    axisLine={false} 
                    tickLine={false} 
                    width={130}
                  />
                  <Tooltip 
                    formatter={(value: any) => [\`\${Number(value).toLocaleString()} Ks\`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'var(--color-card, #1e293b)', borderColor: 'var(--color-border, #334155)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="revenue" name="Revenue (Ks)" fill="#10B981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>`;

const replacement1 = `        {/* CHART 3A: TOP-SELLING SERVICES BY REVENUE (HORIZONTAL BAR CHART) */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Award size={18} className="text-primary" /> Top Services by Revenue
              </h3>
              <p className="text-xs text-muted-foreground">Most requested nail treatments by revenue volume</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-lg">
              Horizontal Bar
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            {topServicesByRevenue.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                <p className="text-xs font-bold">No services sold yet in this period.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={topServicesByRevenue} 
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-muted-foreground/40" />
                  <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => \`\${v >= 1000000 ? (v/1000000).toFixed(1) + 'M' : (v/1000).toFixed(0) + 'k'}\`} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 11, fontWeight: 700 }} 
                    axisLine={false} 
                    tickLine={false} 
                    width={130}
                  />
                  <Tooltip 
                    formatter={(value: any) => [\`\${Number(value).toLocaleString()} Ks\`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'var(--color-card, #1e293b)', borderColor: 'var(--color-border, #334155)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="revenue" name="Revenue (Ks)" fill="#10B981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CHART 3B: TOP-SELLING SERVICES BY USAGE (HORIZONTAL BAR CHART) */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Award size={18} className="text-primary" /> Top Services by Usage
              </h3>
              <p className="text-xs text-muted-foreground">Most requested nail treatments by customer usage</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-lg">
              Horizontal Bar
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            {topServicesByUsage.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                <p className="text-xs font-bold">No services sold yet in this period.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={topServicesByUsage} 
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-muted-foreground/40" />
                  <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 11, fontWeight: 700 }} 
                    axisLine={false} 
                    tickLine={false} 
                    width={130}
                  />
                  <Tooltip 
                    formatter={(value: any) => [value, 'Count']}
                    contentStyle={{ backgroundColor: 'var(--color-card, #1e293b)', borderColor: 'var(--color-border, #334155)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" name="Count" fill="#3B82F6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>`;

const target2 = `        {/* CHART 4: HOURLY TRAFFIC & PEAK HOURS (COLUMN CHART) */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-between">`;
const replacement2 = `        {/* CHART 4: HOURLY TRAFFIC & PEAK HOURS (COLUMN CHART) */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col justify-between lg:col-span-2">`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);
fs.writeFileSync('src/pages/BusinessAnalysisPage.tsx', content);
