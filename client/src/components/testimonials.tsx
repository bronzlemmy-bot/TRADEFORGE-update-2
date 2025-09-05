import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Portfolio Manager",
    company: "Invest Capital",
    content: "The trading bots have revolutionized my investment strategy. I've seen consistent returns while spending less time monitoring markets. The copy trading feature is particularly impressive.",
    rating: 5,
    verified: true
  },
  {
    id: "2", 
    name: "Michael Rodriguez",
    role: "Day Trader",
    company: "Independent",
    content: "Best trading platform I've used. The signals are incredibly accurate and the Bitcoin deposit system is seamless. Made over $50k in profits this quarter alone.",
    rating: 5,
    verified: true
  },
  {
    id: "3",
    name: "Emma Thompson",
    role: "Crypto Investor",
    company: "BlockChain Ventures",
    content: "The expert copy trading changed my trading game completely. Following top traders has given me exposure to strategies I never would have discovered on my own.",
    rating: 5,
    verified: true
  },
  {
    id: "4",
    name: "David Park",
    role: "Financial Advisor",
    company: "Wealth Solutions",
    content: "I recommend this platform to all my clients. The market analysis tools are professional-grade and the withdrawal process is faster than traditional brokers.",
    rating: 5,
    verified: true
  },
  {
    id: "5",
    name: "Lisa Johnson", 
    role: "Algorithmic Trader",
    company: "Quant Strategies",
    content: "The bot automation is sophisticated yet user-friendly. I can customize strategies and the risk management features give me confidence in volatile markets.",
    rating: 5,
    verified: true
  },
  {
    id: "6",
    name: "James Wilson",
    role: "Retail Investor", 
    company: "Personal Trading",
    content: "Started with just $1000 and now managing $25k portfolio. The educational resources and expert signals helped me learn while earning. Couldn't be happier.",
    rating: 5,
    verified: true
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
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

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          {...fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="text-primary">10,000+</span> Traders
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what our users say about their trading success with our platform
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={fadeInUp}>
              <Card className="glass-card h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <Quote className="w-8 h-8 text-primary/30" />
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" title="Verified User" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$2.5B+</div>
            <div className="text-sm text-muted-foreground">Total Volume Traded</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500K+</div>
            <div className="text-sm text-muted-foreground">Successful Trades</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Customer Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}