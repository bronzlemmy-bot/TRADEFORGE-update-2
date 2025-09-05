import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { User, BarChart3 } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const stats = [
  { value: "250K+", label: "Active Traders" },
  { value: "$2.1B", label: "Volume Traded" },
  { value: "99.9%", label: "Uptime" },
  { value: "150+", label: "Markets" }
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    description: "Former Goldman Sachs VP with 15+ years in fintech innovation"
  },
  {
    name: "Marcus Rodriguez", 
    role: "CTO & Co-Founder",
    description: "Ex-Stripe engineer specializing in high-frequency trading systems"
  },
  {
    name: "Emily Johnson",
    role: "Head of Security", 
    description: "Cybersecurity expert with background in financial compliance"
  }
];

export default function About() {
  return (
    <div className="pt-16">
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About TradePro
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering traders with cutting-edge technology and professional-grade tools
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="glass-card p-12 mb-16">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    At TradePro, we believe that everyone deserves access to professional-grade trading tools. Our mission is to democratize trading by providing intuitive, powerful, and secure platforms that level the playing field for all investors.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We combine cutting-edge technology with user-friendly design to create trading experiences that are both powerful and accessible.
                  </p>
                </div>
                <div className="relative">
                  <div className="chart-placeholder h-80 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary/10 to-accent/10">
                    <BarChart3 className="text-primary text-6xl opacity-50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <Card className="glass-card p-8 text-center">
                <CardContent className="p-0">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
          </div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {team.map((member, index) => (
              <motion.div key={member.name} variants={fadeInUp}>
                <Card className="glass-card p-8 text-center h-full">
                  <CardContent className="p-0">
                    <div className={`w-24 h-24 bg-gradient-to-r ${
                      index % 2 === 0 ? 'from-primary to-accent' : 'from-accent to-primary'
                    } rounded-full mx-auto mb-6 flex items-center justify-center`}>
                      <User className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className={`mb-4 ${
                      index % 2 === 0 ? 'text-primary' : 'text-accent'
                    }`}>{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
